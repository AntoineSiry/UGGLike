async function setProfileInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    
    const profileInfoStr = urlParams.get('profileInfo');
    const profileInfo = JSON.parse(decodeURIComponent(profileInfoStr));
    
    let imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${profileInfo.profileIconId}.png`
    document.getElementById("profileIcon").src = imageUrl;
    
    const link = `http://localhost:3000/getPlayerRankedInfo/${profileInfo.id}`;
    const linkSummoner = `http://localhost:3000/getPlayerAccount/${profileInfo.puuid}`;

    const reponse = await fetch(link);
    const reponseSum = await fetch(linkSummoner);

    let data = await reponse.json();
    let dataSum = await reponseSum.json();

    const playerLevel = document.getElementById("playerLevel");
    playerLevel.innerHTML = profileInfo.summonerLevel;

    const playerRiotId = document.getElementById("riotId");
    playerRiotId.innerHTML = dataSum.gameName + "#" + dataSum.tagLine;

    setSoloRankedInfo(data[1]);
    setFlexRankedInfo(data[0]);
    setColorToPPBorder(data[1].tier, data[0].tier);
    
}

function setSoloRankedInfo(soloRankedData){
    let soloTierDisplay = document.getElementById("tierSolo");
    let soloWinsLossesDisplay = document.getElementById("wins-losses-Solo");

    soloTierDisplay.innerHTML = soloRankedData.tier + " " + soloRankedData.rank;
    soloWinsLossesDisplay.innerHTML = soloRankedData.wins + "W " + soloRankedData.losses + "L";
}

function setFlexRankedInfo(flexRankedData){
    let flexTierDisplay = document.getElementById("tierFlex");
    let flexWinsLossesDisplay = document.getElementById("wins-losses-Flex");

    flexTierDisplay.innerHTML = flexRankedData.tier + " " + flexRankedData.rank;
    flexWinsLossesDisplay.innerHTML = flexRankedData.wins + "W " + flexRankedData.losses + "L";
}

function setColorToPPBorder(soloRank, flexRank){
    const ranks = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
    const colors = ["#3d2e2b", "#81554e", "#9daebb", "#e3ac6b", "#3faad0", "#0ea13e", "#3025d3", "#963bd7", "#a02b23", "#aef3fd"];

    let idFlexRank;
    let idSoloRank;

    ranks.forEach(function(entry, index){
        if(soloRank === entry){
            idSoloRank = index;
        }
        if(flexRank === entry){
            idFlexRank = index;
        }
    });

    let bestRank = Math.max(idFlexRank, idSoloRank);

    const profileIcon = document.getElementById("profileIcon");
    const playerLevel = document.getElementById("playerLevel");
    profileIcon.style.borderColor = colors[bestRank];
    playerLevel.style.borderColor = colors[bestRank];

    setRankedIcons(idSoloRank, idFlexRank);

}

function setRankedIcons(indexSoloq, indexFlexq){
    const ranksImg = ["../Ranked Emblems Latest/Rank=Iron.png", 
        "../Ranked Emblems Latest/Rank=Bronze.png",
        "../Ranked Emblems Latest/Rank=Silver.png",
        "../Ranked Emblems Latest/Rank=Gold.png",
        "../Ranked Emblems Latest/Rank=Platinum.png",
        "../Ranked Emblems Latest/Rank=Emerald.png",
        "../Ranked Emblems Latest/Rank=Diamond.png",
        "../Ranked Emblems Latest/Rank=Master.png",
        "../Ranked Emblems Latest/Rank=Grandmaster.png",
        "../Ranked Emblems Latest/Rank=Challenger.png",
    ];

    const soloqRankIcon = document.getElementById("soloRankIcon");
    const flexRankIcon = document.getElementById("flexRankIcon");
    soloqRankIcon.src = ranksImg[indexSoloq];
    flexRankIcon.src = ranksImg[indexFlexq];
    
}