function detectKey(event){
    if(event.key === "Enter"){
        let inputValue = event.target.value;

        if(inputValue.trim() !== ""){
            getPUUIDfromName(inputValue);
        }
    }    

}

function getNameAndID(input){
    let [pseudo, id] = input.split("#");
    return {pseudo: pseudo, id: id};
}

async function getPUUIDfromName(input) {

    const RiotID = getNameAndID(input);
    const link = `http://localhost:3000/getPUUID/${RiotID.pseudo}/${RiotID.id}`;

    const reponse = await fetch(link);

    let data = await reponse.json();

    console.log("Puuid: " + data.puuid);

    getPlayerInfoFromPUUID(data.puuid);
}

async function getPlayerInfoFromPUUID(PUUID) {

    const link = `http://localhost:3000/getPlayerInfo/${PUUID}`;

    const reponse = await fetch(link);

    let data = await reponse.json();

    console.log("ID: " + data.id);
    console.log("AccountID: " + data.accountId);
    console.log("PUUID: " + data.puuid);
    console.log("profileIconId: " + data.profileIconId);
    console.log("revisionDate: " + data.revisionDate);
    console.log("summonerLevel: " + data.summonerLevel);

    goToNewPage(data);
}

function goToNewPage(profileInfo){

    const profileInfoStr = JSON.stringify(profileInfo);

    const encodedProfileInfo = encodeURIComponent(profileInfoStr);

    window.location.href = `profilePage.html?profileInfo=${encodedProfileInfo}`;
}




