let arrayOptions = [],
    optionText = [],
    optionValue = [],
    buttonClick = [],
    collectId = [],
    optionValueDefault = [];
function MultiSelect(id, custom) {
    let optionSet = [];
    const init = (id, custom) => {
        let selectElement = document.getElementById(id);
        let options = selectElement.options;

        collectId.push(id);

        for (let ii = 0; ii < options.length; ii++) {
            if (options[ii].role !== "default") {
                optionText.push({
                    text: options[ii].innerText,
                    id: id
                });
                optionValue.push({
                    value: options[ii].value,
                    id: id
                });
            }
            else {
                optionValueDefault.push({
                    id: `contain--all--multiselect--${id}`,
                    value: options[ii]
                });
            }
        }

        selectElement.style.display = "none";
        createElement(selectElement, id);

    }

    const createElement = (selectElements, idElement) => {
        let myId = `contain--all--multiselect--${idElement}`;
        // id = `contain--all--multiselect--${idElement}`
        let idButtonOpen = `button--multiselect--${idElement}`
        selectElements.parentNode.innerHTML += `
        <div id="${myId}" style="margin-bottom:5px;min-width: 418px;max-width: 600px;">
            <div class="container--multiselect" style="display:flex; flex-direction:row;justify-content: space-between;">
                <div class="items--multiselect">
                    <input type="text" id="text--default" readonly style="font-size:18px; margin-top:5px;margin-left:5px;border-color:transparent;cursor:default;"/>
                    <div style="display: flex;flex-direction: row;flex-wrap: wrap;padding:5px"></div>
                </div>
                <div id="button--action--option" style="cursor:pointer;margin-right:5px;padding:5px 0px">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="20px"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 21 6 15"></polyline>
                    </svg>
                </div>
            </div>
            <div class="container--options"></div>
        </div>`;


        EditTextDefault(myId);


        document.querySelectorAll(`#button--action--option`).forEach(el => {
            el.addEventListener("click", (e) => {
                createOptions(e);
            })
        })


        //Style
        let containerStyle = document.querySelector(`#${myId}`);

        //style Container MultiSelect
        let multiSelector = containerStyle.querySelector(".container--multiselect");
        let bordercolor = custom.borderColor == undefined ? 'black' : custom.borderColor;

        multiSelector.style.border = "1px solid " + bordercolor;
        multiSelector.style.width = "60%";
        // multiSelector.style.height = "35px";
        multiSelector.style.borderRadius = custom.borderRadius;


        //style Container MultiSelect Options
        let optionsMultiSelector = containerStyle.querySelector(".container--options");
        // optionsMultiSelector.style.border = "1px solid black";
        optionsMultiSelector.style.width = "60%";
    }

    const createOptions = (e) => {
        optionSet = [];

        let optionsId = e.target.parentElement.parentElement.parentElement.id;

        if (optionsId == '') {
            optionsId = e.target.parentElement.parentElement.parentElement.parentElement.id;
        }

        let buttonClicked = true;

        noObject = false;

        for (let ll = 0; ll < buttonClick.length; ll++) {
            noObject = true;
            if (buttonClick.filter(el => el.id == optionsId).length > 0) {
                buttonClick[ll].key = !buttonClick[ll].key;
                buttonClicked = buttonClick[ll].key;
            }
            else {
                buttonClick.push({
                    id: optionsId,
                    key: true
                });
                break;
            }
        }

        if (!noObject) {
            buttonClick.push({
                id: optionsId,
                key: true
            });
        }


        let optionsMultiSelector = document.querySelector(`#${optionsId} .container--options`);

        for (let kk = 0; kk < optionValue.length; kk++) {
            if (`contain--all--multiselect--` + optionValue[kk].id == optionsId) {
                optionSet.push({
                    text: optionText[kk].text,
                    value: optionValue[kk].value
                })
            }
        }

        hideAllOptions();

        if (buttonClicked) {
            optionsMultiSelector.style.border = "1px solid black";
            optionsMultiSelector.style.borderTop = "0px solid";
            for (let jj = 0; jj < optionSet.length; jj++) {
                let optionChecked = arrayOptions.filter(arro => arro.id == optionsId);
                if (optionChecked.length > 0) {
                    optionsMultiSelector.innerHTML += `
                        <div>
                            <div>
                                <input type="checkbox" value="${optionSet[jj].value}" ${optionChecked.filter(oc => oc.value == optionSet[jj].value).length > 0 ? "checked" : ""} id="${optionsId}"/>
                                <label>${optionSet[jj].text}</label>
                            </div>
                        </div>
                    `;
                }
                else {
                    optionsMultiSelector.innerHTML += `
                        <div>
                            <div>
                                <input type="checkbox" value="${optionSet[jj].value}" id="${optionsId}"/>
                                <label>${optionSet[jj].text}</label>
                            </div>
                        </div>
                    `;
                    EditTextDefault(optionsId);
                }
            }
        }
        else {
            optionsMultiSelector.style.border = "1px solid transparent";
            optionsMultiSelector.innerHTML = ``;
        }

        let checkboxOptions = optionsMultiSelector.querySelectorAll("div div input");

        checkboxOptions.forEach(el => {
            el.addEventListener("change", (e) => {
                checkHandler(e);
                OnChange(e.target.id);
            })
        })
    }

    const EditTextDefault = (optionsId) => {
        document.querySelector(`#${optionsId} div div #text--default`).placeholder = optionValueDefault.filter(el => el.id === optionsId)[0].value.text;

        document.querySelector(`#${optionsId} div div #text--default`).style.display = "block";

        collectId.forEach(el => {
            document.querySelector(`#contain--all--multiselect--${el} div div #text--default`).addEventListener("focus", (e) => {
                e.target.style.outlineColor = "transparent";
            });
        });
    }


    const RemoveTextDefault = (optionsId) => {
        document.querySelector(`#${optionsId} div div #text--default`).style.display = "none";
    }

    const checkHandler = (e) => {

        let idTarget = e.target.id;

        let label = e.target.parentNode.querySelector("label").innerText;

        if (e.target.checked) {
            arrayOptions.push({
                id: idTarget,
                value: e.target.value,
                text: label
            });
            createList(idTarget);
            RemoveTextDefault(idTarget);
        }
        else {
            let arrTemp = [];
            let arrTarget = arrayOptions.filter(el => el.id == idTarget);
            let arrTargetTemp = [];

            //vaciar el id seleccionado
            arrTarget.forEach(arr => {
                if (arr.value != e.target.value) {
                    arrTargetTemp.push({
                        id: arr.id,
                        value: arr.value,
                        text: arr.text
                    });
                }
            });
            arrTarget = arrTargetTemp;

            //separar el id seleccionado para no quede rastro
            arrayOptions.forEach(arr => {
                if (arr.id !== idTarget) {
                    arrTemp.push(arr);
                }
            });

            //Luego del filtrado unificamos
            arrTarget.forEach((arr) => {
                arrTemp.push(arr);
            });


            arrayOptions = arrTemp;
            createList(idTarget);

            if (arrayOptions.filter(el => el.id == idTarget).length == 0) {
                EditTextDefault(idTarget);
            }
        }
    }

    const createList = (optionsId) => {
        let arrText = arrayOptions.filter(el => el.id == optionsId);

        document.querySelector(`#${optionsId} .container--multiselect .items--multiselect div`).innerHTML = ``;

        arrText.forEach(el => {
            if (el.id == optionsId) {
                document.querySelector(`#${optionsId} .container--multiselect .items--multiselect div`).innerHTML += `<label style="margin-right:5px; font-size:12px;border:1px solid #2c8fff; color:white; background-color:#2c8fff;border-radius:3.5px;padding:1px;margin-left:3px;margin-top:2px;">${el.text}</label>`;
            }
        })
    }

    const OnChange = (id) => {
        let arrItems = [];
        arrayOptions.filter(e => e.id == id).forEach(item => {
            arrItems.push({
                value: item.value,
                text: item.text
            })
        });
        custom.onChange(arrItems);
    }

    const hideAllOptions = ()=>{
        document.querySelectorAll(".container--options").forEach(op=>{
            op.style.borderColor = "transparent";
            op.innerHTML=``;
        })
    }

    window.addEventListener("click",(e)=>{
        if(e.target.localName != "svg" && e.target.localName != "input" && e.target.type != "checkbox"){
            hideAllOptions();
            buttonClick.forEach(btn=>{
                btn.key = false;
            })
        }
    })

    init(id, custom);


}