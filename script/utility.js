

/**
 *function to fetch values for each id and change it dynamically
 *
 * @export
 * @param {*} UIElementID
 * @param {*} UIAttribute
 * @param {*} valueToUpdate
 */
export function updateUIWithGivenAttributeValue(UIElementID, UIAttribute,valueToUpdate) {
    /* if the attribute is src */
    if(UIAttribute=="src") {

          document.getElementById(UIElementID).src = valueToUpdate;

    } 
    /* if the attribute is innerHTML */
    else if(UIAttribute=="innerHTML"){

        document.getElementById(UIElementID).innerHTML = valueToUpdate;

    }
    else if(UIAttribute=="borderBottom"){
        document.getElementById(UIElementID).style.borderBottom= valueToUpdate;
    }
}