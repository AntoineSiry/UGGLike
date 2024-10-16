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

    //console.log(data);

    setSoloRankedInfo(data[0]);
    setFlexRankedInfo(data[1]);
    setColorToPPBorder(data[1].tier, data[0].tier);

    getMatchsId(profileInfo.puuid);
    
}

function setSoloRankedInfo(soloRankedData){
    let soloTierDisplay = document.getElementById("tierSolo");
    let soloWinsLossesDisplay = document.getElementById("wins-losses-Solo");
    let soloqLp = document.getElementById("soloqLp");

    soloTierDisplay.innerHTML = soloRankedData.tier + " " + soloRankedData.rank;
    soloWinsLossesDisplay.innerHTML = soloRankedData.wins + "W " + soloRankedData.losses + "L";
    soloqLp.innerHTML = soloRankedData.leaguePoints + "LP";
}

function setFlexRankedInfo(flexRankedData){
    let flexTierDisplay = document.getElementById("tierFlex");
    let flexWinsLossesDisplay = document.getElementById("wins-losses-Flex");
    let flexLp = document.getElementById("FlexLp");

    flexTierDisplay.innerHTML = flexRankedData.tier + " " + flexRankedData.rank;
    flexWinsLossesDisplay.innerHTML = flexRankedData.wins + "W " + flexRankedData.losses + "L";
    flexLp.innerHTML = flexRankedData.leaguePoints + "LP";
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

function setRankedIcons(indexFlexq, indexSoloq){
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

async function getMatchsId(puuid){

    const link = `http://localhost:3000/getMatchBypuuid/${puuid}`;

    const reponse = await fetch(link);

    let data = await reponse.json();

    //console.log(data);
    data.forEach(function(matchId){
        getMatchByMatchId(matchId);
    });
    
}

async function getMatchByMatchId(matchId) {
    const link = `http://localhost:3000/getMatchByMatchId/${matchId}`;

    const reponse = await fetch(link);

    let data = await reponse.json();

    console.log(data);

    //createMatchRecap(data);
}

function createMatchRecap(match){
    return `
    <div class="match">
        <div class="match-header">
            <div class="rank">${match.rank}</div>
            <div class="lp">${match.lp > 0 ? '+' + match.lp : match.lp} LP</div>
            <div class="result ${match.result.toLowerCase()}">${match.result}</div>
            <div class="match-duration">${match.duration}</div>
        </div>
        <div class="match-body">
            <div class="player-stats">
                <div class="champion-icon">
                    <img src="champion-image.jpg" alt="Champion">
                </div>
                <div class="player-kda">
                    <span>${match.kda.kills} / ${match.kda.deaths} / ${match.kda.assists}</span>
                    <div class="kda-ratio">${match.kda.ratio} KDA</div>
                </div>
                <div class="cs-vision">
                    <span>${match.cs} CS</span>
                    <span>${match.vision} vision</span>
                </div>
            </div>
            <div class="items">
                ${match.items.map(item => `<img src="${item}" alt="Item">`).join('')}
            </div>
            <div class="teams">
                <div class="team team-blue">
                    ${match.blueTeam.map(player => `<span>${player}</span>`).join('')}
                </div>
                <div class="team team-red">
                    ${match.redTeam.map(player => `<span>${player}</span>`).join('')}
                </div>
            </div>
        </div>
    </div>
`;
}