const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        input.readString('five.txt').then(polymer => {
            let reaction = react(polymer);

            while ( reaction.changed ) {
                reaction = react(reaction.newPolymer);
            }

            resolve(reaction.newPolymer.length);
        });
    })
}

function two() {
    return new Promise(resolve => {
        input.readString('five.txt').then(polymer => {
            let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
                min = polymer.length;

            letters.forEach(letter => {
                let stripped = remove(letter, polymer),
                    reaction = react(stripped);

                while ( reaction.changed ) {
                    reaction = react(reaction.newPolymer);
                }

                if (reaction.newPolymer.length < min) {
                    min = reaction.newPolymer.length
                }
            });


            resolve(min);
        });
    })
}

function react(polymer) {
    let newPolymer = '',
        changed = false;

    for (let i = 0; i < polymer.length; i++) {
        let first = polymer.charAt(i),
            second = polymer.charAt(i + 1);

        if (first.toLowerCase() === second.toLowerCase() && first !== second) {
            changed = true;
            i++;
        } else {
            newPolymer += first;
        }
    }

    return { newPolymer, changed }
}

function remove(char, polymer) {
    return polymer.replace(new RegExp(`[${char}${char.toUpperCase()}]`, 'g'), '')
}

module.exports = {
    one,
    two
};
