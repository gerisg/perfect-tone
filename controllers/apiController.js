const data = require('../database/data');

/* Get data from IDs */
let populateFromParams = params => {
    return {
        current: params.current ? data.currentTones.find(tone => tone.id == params.current) : undefined,
        natural: params.natural ? data.naturalTones.find(tone => tone.id == params.natural) : undefined,
        desired: params.desired ? data.desired.find(tone => tone.value == params.desired) : undefined,
        greys: params.greys ? data.greys.find(grey => grey.value == params.greys) : undefined,
    }
}

let dark = (tone) => --tone;
let light = (tone) => ++tone;

function validateTone(tone, operation) {
    // Validate tones
    if(!operation) {
        if(tone <= 0) return 1;
        else if (tone >= 10) return 9;
        return tone;
    }
    // Apply operation and validate
    let newTone = operation(tone);
    if(newTone <= 0) { 
        return 1; 
    } else if(newTone == 2) {
        newTone = operation(newTone);
    } else if(newTone >= 10) {
        return 9; 
    }
    return newTone;
}

function calculateTone(desired, base, greys, colored) {
    let suggestedtones = [];
    let baseToneId = parseInt(base.id);

    // Get suggested tones from current and desired tone
    switch (desired.value) {
        case 'equal':
            // Suggest same tone
            suggestedtones.push(validateTone(baseToneId));
            break;
        case 'light':
            // Suggest one more tone
            suggestedtones.push(validateTone(baseToneId, light));
            // Suggest two more tones only for non colored hairs and currents tones up or equals to 5
            if(!colored && baseToneId >= 5)
                suggestedtones.push(validateTone(baseToneId + 1, light));
            break;
        case 'dark':
            // Suggest one less tone
            suggestedtones.push(validateTone(baseToneId, dark));
            break;
        default: 
            // Don't know desired tone. Suggest one more tone only non colored hairs, same and one less tone too.
            if(!colored)
                suggestedtones.push(validateTone(baseToneId, light));
            // Suggest 
            suggestedtones.push(baseToneId);
            suggestedtones.push(validateTone(baseToneId, dark));
    }

    // Unique values
    suggestedtones = Array.from(new Set(suggestedtones));

    // Filtro las familias que tienen al menos uno de los tonos sugeridos
    let filteredReflexes = data.families.filter(
        family => suggestedtones.map(
            suggestion => family.tones.includes(suggestion)).reduce(
                (result, current) => result || current)); // Puede devolver múltiples true/false entonces los reduzco
    
    // Filtro las familias según si aplican a rojos o no
    filteredReflexes = base.category == 'rojos y cobrizos' ? 
        filteredReflexes.filter(family => family.onlyRedBased) : 
        filteredReflexes.filter(family => typeof(family.onlyRedBased) == 'undefined' || !family.onlyRedBased);

    // Filtro las familias según el porcentaje de canas
    filteredReflexes = filteredReflexes.filter(family => {
        let configuredToRemove = family.filterWhiteHair ? family.filterWhiteHair[greys.value] : undefined;
        // Si la familia no tiene colores para remover según el porcentaje de canas sigue en la lista de familias sugeridas
        if (!configuredToRemove || configuredToRemove.length == 0)
            return true;
        // Si la familia fue elegida por un producto que no corresponde al porcentaje de canas del usuario, debo removerlo de las familias sugeridas
        let foundToRemove = configuredToRemove.find( prodToRemove => {
            let tone = parseInt(prodToRemove.split('.')[0]);
            return suggestedtones.includes(tone);
        });
        return !foundToRemove;
    });

    const onlyRedProducts = data.onlyRedProducts;
    const isRedBase = base.category == 'rojos y cobrizos';
    const noWhiteHairProducts = data.noWhiteHairProducts;
    const hasGrey = greys.value >= 2;

    // Filtro los productos de las familias
    filteredReflexes = filteredReflexes.map(family => {
        return { ...family, products: family.products.filter(
            prod => {
                // Si no incluyen el tono sugerido lo descarto
                const includeSuggestedTone = suggestedtones.includes(parseInt(prod.id.split('.')[0]));
                if(!includeSuggestedTone) {
                    return false;
                }
                // Si la base del cliente no es roja, descarto los productos que son sólo para rojos
                const isOnlyForRedBase = onlyRedProducts.includes(prod.id);
                if(!isRedBase && isOnlyForRedBase) {
                    return false;
                }
                // Si el cliente tiene canas, filtro los productos que no aplican
                const notApplyForGreys = noWhiteHairProducts.includes(prod.id);
                if(hasGrey && notApplyForGreys) {
                    return false;
                }
                return true;
            }
        )}
    });

    return { tones: suggestedtones, reflexes: filteredReflexes };
}

module.exports = {
    reflexes: (req, res) => {
        let populatedParams = populateFromParams(req.body);
        let base = populatedParams.natural;
        let colored = populatedParams.current ? true : false;
        if(colored) { 
            let diffTone = parseInt(populatedParams.current.id) - parseInt(populatedParams.natural.id);
            if(diffTone != 0) {
                base = populatedParams.current;
            }
        }
        let reflexes = calculateTone(populatedParams.desired, base, populatedParams.greys, colored);
        // Absolute WooCommerce URL [TODO] Find a better place to do it.
        reflexes.reflexes.forEach(reflex => reflex.products.forEach(product => {
            if(!product.wc.startsWith('http'))
                product.wc = `${process.env.COBEAUTY_HOST}/product/${product.wc}`;
        }));
        res.send(reflexes);
    }
}