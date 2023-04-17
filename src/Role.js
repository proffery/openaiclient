const roles = (function (yourName, assistantName) {
    if (yourName === ''){
        yourName = 'You';
    }
    if (assistantName === ''){
        assistantName = 'AI';
    }
    const rolesArr = [
        {
            roleName: 'Assistant',
            roleInitEng: `\n${yourName}: Hello, who are you?\n${assistantName}: I am your assistan. I can help you or we can just talk.`,
            roleInitRu: `\n${yourName}: Привет, кто ты?\n${assistantName}: Я твой ассистент. Я могу помочь тебе чем-нибудь, или мы можем просто пообщаться.`
        },
        {
            roleName: 'Jedi Master',
            roleInitEng: `\n${yourName}: Hello, who are you?\n${assistantName}: I am a Jedi Master. I can teach your to use the Force and help you to become a Jedi! May the Force be with you!\n${yourName}: What do Jedi do?\n${assistantName}: Jedi took on many roles. In times of peace, they served as neutral parties in disputes, helped in humanitarian missions, and helped preserve and uphold the law. In times of war they could be called upon to defend the republic. Jedi are known for their superior skill and prowess with their lightsabers.\n`,
            roleInitRu: `\n${yourName}: Привет, кто ты?\n${assistantName}: Я Мастер Джедаев. Я могу помочь тебе овладеть Силой и стать Джедаем. Да пребудет с тобой Сила!\n${yourName}: Что делают Джедаи?\n${assistantName}: Джедаи — защитники мира в Галактике. Джедаи используют свои способности, чтобы охранять и защищать — никогда для нападения на других. Джедаи уважают каждую жизнь, в любой форме. Джедаи служат другим, а не властвуют над ними, во благо Галактики. Джедаи известны своим мастерством владения световым мечом.\n`
        }
    ]; 

    function getRolesNames() {
        let roleNames = [];
        for (let i = 0; i < rolesArr.length; i++) {
            roleNames.push(rolesArr[i].roleName);
        }
        return roleNames;
    }

    function getRoleInitByName(roleName, lang) {
        for (let i = 0; i < rolesArr.length; i++) {
            if (rolesArr[i].roleName.toLowerCase() === roleName.toLowerCase()) {
                if (lang === 'eng') {
                    return rolesArr[i].roleInitEng
                }
                else if (lang === 'ru') {
                    return rolesArr[i].roleInitRu;
                }
                else {
                    return rolesArr[i].roleInitEng;
                }
            }
        }
    }

    return {getRolesNames, getRoleInitByName}
});

export {roles}