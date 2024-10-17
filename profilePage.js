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

    if(data.length > 1){
      setSoloRankedInfo(data[0]);
      setFlexRankedInfo(data[1]);
      setColorToPPBorder(data[0].tier, data[1].tier);
    }else if(data[0].queueType === 'RANKED_SOLO_5x5' && data.length <= 1){
      setSoloRankedInfo(data[0]);
      setFlexRankedInfo(null);
      setColorToPPBorder(data[0].tier);
    }else if(data[0].queueType === 'RANKED_FLEX_SR' && data.length <= 1){
      setSoloRankedInfo(null);
      setFlexRankedInfo(data[0]);
      setColorToPPBorder(data[0].tier);
    }
    
    getMatchsId(profileInfo.puuid);
    
}

function setSoloRankedInfo(soloRankedData){

  let soloTierDisplay = document.getElementById("tierSolo");

  if(soloRankedData != null){
    let soloWinsLossesDisplay = document.getElementById("wins-losses-Solo");
    let soloqLp = document.getElementById("soloqLp");
    soloTierDisplay.innerHTML = soloRankedData.tier + " " + soloRankedData.rank;
    soloWinsLossesDisplay.innerHTML = soloRankedData.wins + "W " + soloRankedData.losses + "L";
    soloqLp.innerHTML = soloRankedData.leaguePoints + "LP";
    return;
  }
    soloTierDisplay.innerHTML = "Unranked";
}

function setFlexRankedInfo(flexRankedData){

  let flexTierDisplay = document.getElementById("tierFlex");

  if(flexRankedData != null){
    let flexWinsLossesDisplay = document.getElementById("wins-losses-Flex");
    let flexLp = document.getElementById("FlexLp");
    flexTierDisplay.innerHTML = flexRankedData.tier + " " + flexRankedData.rank;
    flexWinsLossesDisplay.innerHTML = flexRankedData.wins + "W " + flexRankedData.losses + "L";
    flexLp.innerHTML = flexRankedData.leaguePoints + "LP";
    return;
  }

  flexTierDisplay.innerHTML = "Unranked";

}

function setColorToPPBorder(flexRank, soloRank){
    const ranks = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
    const colors = ["#3d2e2b", "#81554e", "#9daebb", "#e3ac6b", "#3faad0", "#0ea13e", "#3025d3", "#963bd7", "#a02b23", "#aef3fd"];

    let idFlexRank;
    let idSoloRank;

    if(soloRank != null && flexRank != null){
      for(const [index, entry] of ranks.entries()) {
        const entry=ranks[index];
        if(soloRank === entry){
          idSoloRank = index;
      }
        if(flexRank === entry){
          idFlexRank = index;
        }
      }
  
      let bestRank = Math.max(idFlexRank, idSoloRank);
  
      const profileIcon = document.getElementById("profileIcon");
      const playerLevel = document.getElementById("playerLevel");
      profileIcon.style.borderColor = colors[bestRank];
      playerLevel.style.borderColor = colors[bestRank];
      setRankedIcons(idSoloRank, idFlexRank); 

    }else if(soloRank != null && flexRank == null){
      ranks.forEach(function(entry, index){
        if(soloRank === entry){
            idSoloRank = index;
            // Penser a mettre un break ici
        }
        const profileIcon = document.getElementById("profileIcon");
        const playerLevel = document.getElementById("playerLevel");
        profileIcon.style.borderColor = colors[idSoloRank];
        playerLevel.style.borderColor = colors[idSoloRank];
        setRankedIcons(idSoloRank, 10);
      });
      return;
    }else{
      ranks.forEach(function(entry, index){
        if(flexRank === entry){
            idFlexRank = index;
            // Penser a mettre un break ici
        }
      const profileIcon = document.getElementById("profileIcon");
      const playerLevel = document.getElementById("playerLevel");
      profileIcon.style.borderColor = colors[idFlexRank];
      playerLevel.style.borderColor = colors[idFlexRank];
      setRankedIcons(10, idFlexRank);
    });
  } 
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
        "../Ranked Emblems Latest/Rank=Unranked.png",
    ];

    const soloqRankIcon = document.getElementById("soloRankIcon");
    const flexRankIcon = document.getElementById("flexRankIcon");
    soloqRankIcon.src = ranksImg[indexSoloq];
    flexRankIcon.src = ranksImg[indexFlexq];
    
}

async function getMatchsId(puuid){

    const link = `http://localhost:3000/getMatchBypuuid/${puuid}`;

    const reponse = await fetch(link);

    let matchs = await reponse.json();

    for(let i = 0; i < matchs.length; i++){
        const match = matchs[i];
        await getMatchByMatchId(match, puuid);
    }

    // matchs.forEach(function(matchId){
    //     getMatchByMatchId(matchId, puuid);
    // });
}

async function getMatchByMatchId(matchId, puuid) {
    const link = `http://localhost:3000/getMatchByMatchId/${matchId}`;

    const reponse = await fetch(link);

    let match = await reponse.json();

    //console.log(match);

    let searchedPlayerId = findRightPlayerInfos(puuid, match);

    displayMatch(match, match.info.participants[searchedPlayerId])
}

function createMatchRecap(match, player){

  const champPlayed = player.championName;

  const link = `http://ddragon.leagueoflegends.com/cdn/13.20.1/img/champion/${champPlayed}.png`;

    return `
    <div class="match">
        <div class="match-header">
            <div class="match-duration">${Math.floor(match.info.gameDuration / 60)}:${Math.floor(match.info.gameDuration % 60).toString().padStart(2, '0')}</div>
        </div>
        <div class="match-body">
            <div class="player-stats">
                <div class="champion-icon">
                    <img src="${link}" alt="Champion">
                </div>
                <div class="player-kda">
                    <span>${player.kills} / ${player.deaths} / ${player.assists}</span>
                    <div class="kda-ratio">${player.challenges.kda} KDA</div>
                </div>
                <div class="cs-vision">
                    <span>${player.totalMinionsKilled + player.neutralMinionsKilled} CS</span>
                    <span>${player.visionScore} vision</span>
                </div>
            </div>
            <div class="items">
            </div>
            <div class="teams">
                <div class="team team-blue">
                </div>
                <div class="team team-red">
                </div>
            </div>
        </div>
    </div>
`;
}

function findRightPlayerInfos(Searchedpuuid, match){
    //console.log(match);
    if (match && match.info && Array.isArray(match.info.participants)) {
        return match.info.participants.findIndex(function(player) {
            return player.puuid === Searchedpuuid;
        });
    }
}

function displayMatch(match, player){

    const divRecapMatch = document.getElementById("matchHistory");

    const matchRecap = createMatchRecap(match, player);

    divRecapMatch.insertAdjacentHTML('beforeend', matchRecap);

}

function getAllPlayersInMatch(match){
  // cette fonction get tout les joueurs dans un match (pseudos + champions joué dans la partie)
  // Elle retourne un objet
}

/* <div class="match">
        <div class="match-header">
            <div class="rank">${match.rank}</div>
            <div class="lp">${match.lp > 0 ? '+' + match.lp : match.lp} LP</div>
            <div class="result ${match.result.toLowerCase()}">${match.result}</div>
            <div class="match-duration">${match.duration}</div>
        </div>
        <div class="match-body">
            <div class="player-stats">
                <div class="champion-icon">
                    <img src="" alt="Champion">
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
`; */