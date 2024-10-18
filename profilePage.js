const ranks = {
  IRON: {
    image : "../Ranked Emblems Latest/Rank=Iron.png",
    color :"#3d2e2b",
    id: 0
  },
  BRONZE: {
    image : "../Ranked Emblems Latest/Rank=Bronze.png",
    color :"#81554e",
    id: 1
  },
  SILVER: {
    image : "../Ranked Emblems Latest/Rank=Silver.png",
    color :"#9daebb",
    id: 2
  },
  GOLD: {
    image : "../Ranked Emblems Latest/Rank=Gold.png",
    color :"#e3ac6b",
    id: 3
  },
  PLATINUM: {
    image : "../Ranked Emblems Latest/Rank=Platinum.png",
    color :"#3faad0",
    id: 4
  },
  EMERALD: {
    image : "../Ranked Emblems Latest/Rank=Emerald.png",
    color :"#0ea13e",
    id: 5
  },
  DIAMOND: {
    image : "../Ranked Emblems Latest/Rank=Diamond.png",
    color :"#3025d3",
    id: 6
  },
  MASTER: {
    image : "../Ranked Emblems Latest/Rank=Master.png",
    color :"#963bd7",
    id: 7
  },
  GRANDMASTER: {
    image : "../Ranked Emblems Latest/Rank=Grandmaster.png",
    color :"#a02b23",
    id: 8
  },
  CHALLENGER: {
    image : "../Ranked Emblems Latest/Rank=Challenger.png",
    color :"#aef3fd",
    id: 9
  },
  UNRANKED: {
    image : "../Ranked Emblems Latest/Rank=Unranked.png",
    color : "#414165",
    id: 10
  }   
};

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

    console.log(profileInfo.puuid);
    if(data.length > 0){
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
    }else if(data.length == 0){
      setSoloRankedInfo(null);
      setFlexRankedInfo(null);
      setColorToPPBorder(null, null)
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

function setColorToPPBorder(soloRank, flexRank){

  let soloqRank;
  let flexqRank;

    if(soloRank != null && flexRank != null){

      Object.keys(ranks).forEach(rank => {
        if(soloRank == rank){
          soloqRank = ranks[rank];
        }
        if(flexRank == rank){
          flexqRank = ranks[rank];
        }
      });
  
      let bestRank = soloqRank.id > flexqRank.id ? soloqRank : flexqRank;
  
      const profileIcon = document.getElementById("profileIcon");
      const playerLevel = document.getElementById("playerLevel");
      const soloqRankIcon = document.getElementById("soloRankIcon");
      const flexRankIcon = document.getElementById("flexRankIcon");
      profileIcon.style.borderColor = bestRank.color;
      playerLevel.style.borderColor = bestRank.color;
      soloqRankIcon.src = soloqRank.image;
      flexRankIcon.src = flexqRank.image;
      return;

    }else if(soloRank != null && flexRank == null){
      flexqRank = ranks.UNRANKED;
      Object.keys(ranks).forEach(rank => {
        if(soloRank == rank){
          soloqRank = ranks[rank];
        }
      });
        const profileIcon = document.getElementById("profileIcon");
        const playerLevel = document.getElementById("playerLevel");
        const soloqRankIcon = document.getElementById("soloRankIcon");
        const flexRankIcon = document.getElementById("flexRankIcon");
        profileIcon.style.borderColor = soloqRank.color;
        playerLevel.style.borderColor = soloqRank.color;
        soloqRankIcon.src = soloqRank.image;
        flexRankIcon.src = flexqRank.image;
        return;
    }else if(soloRank == null && flexRank != null)
    {
      soloqRank = ranks.UNRANKED;
      Object.keys(ranks).forEach(rank => {
        if(flexqRank == rank){
          flexqRank = ranks[rank];
        }
      });
      const profileIcon = document.getElementById("profileIcon");
      const playerLevel = document.getElementById("playerLevel");
      const soloqRankIcon = document.getElementById("soloRankIcon");
      const flexRankIcon = document.getElementById("flexRankIcon");
      profileIcon.style.borderColor = flexqRank.color;
      playerLevel.style.borderColor = flexqRank.color;
      soloqRankIcon.src = soloqRank.image;
      flexRankIcon.src = flexqRank.image;
  }else{
    soloqRank = ranks.UNRANKED;
    flexqRank = ranks.UNRANKED;

    const profileIcon = document.getElementById("profileIcon");
    const playerLevel = document.getElementById("playerLevel");
    const soloqRankIcon = document.getElementById("soloRankIcon");
    const flexRankIcon = document.getElementById("flexRankIcon");
    profileIcon.style.borderColor = flexqRank.color;
    playerLevel.style.borderColor = flexqRank.color;
    soloqRankIcon.src = soloqRank.image;
    flexRankIcon.src = flexqRank.image;
  }
} 

async function getMatchsId(puuid){

    const link = `http://localhost:3000/getMatchBypuuid/${puuid}`;

    const reponse = await fetch(link);

    let matchs = await reponse.json();

    for(let i = 0; i < matchs.length; i++){
        const match = matchs[i];
        await getMatchByMatchId(match, puuid);
    }

    console.log(matchs);

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

  let color = player.win ? "#1e2b5e" : "#3e213b";

  const players = getAllPlayersInMatch(match);

  const itemsImg = getItemPurchased(player);

  console.log(match);

  const blueTeamHTML = Object.keys(players)
    .filter(key => players[key].teamId == 100) 
    .map(key => `<div class = "player"> <img src="${players[key].champImg}" alt="Player Champion" id="playerChampion"> 
      <span class="player-name">${players[key].playerName}</span></div>`).join('');

    const redTeamHTML = Object.keys(players)
    .filter(key => players[key].teamId === 200) 
    .map(key => `<div class = "player"> <img src="${players[key].champImg}" alt="Player Champion" id="playerChampion"> 
      <span class="player-name">${players[key].playerName}</span></div>`).join('');

    return `
    <div class="match" style="background-color: ${color};">
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
            ${Object.values(itemsImg).map(item => `<img src="${item.link}" alt="Item" id="itemsImg">`).join('')}
            </div>
            <div class="teams">
                <div class="team-team-blue">
                ${blueTeamHTML}
                </div>
                <div class="team-team-red">
                ${redTeamHTML}
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

  let players = {}
  match.info.participants.forEach(function(player, index){
    let champPlayed = player.championName;
    players[`player${index + 1}`] = {
      champImg: `http://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champPlayed}.png`,  
      playerName: player.riotIdGameName + "#" + player.riotIdTagline,
      teamId: player.teamId 
    };
  });

  return players;
  // cette fonction get tout les joueurs dans un match (pseudos + champions joué dans la partie)
  // Elle retourne un objet
}

function getItemPurchased(player){
  let itemsImg = {
    Item0: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item0}.png`
    },
    Item1: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item1}.png`
    },
    Item2: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item2}.png`
    },
    Item3: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item3}.png`
    },
    Item4: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item4}.png`
    },
    Item5: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item5}.png`
    },
    Item6: {
      link: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${player.item6}.png`
    }
  };
  console.log(itemsImg);
  return itemsImg;
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