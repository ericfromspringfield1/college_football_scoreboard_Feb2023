const scoreboardURL = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=500&dates=20221201-20230115'
let thisGameId
let gameIdsArray = []
let gameIdArray = []
let gameUrl

// State - only track homeScore, awayScore, currentPlay

// Need a button to refresh just the game that has been clicked and a button to take you back to the list of games.

const fetchScoreboard = async () => {
    const jsonData = await fetch (scoreboardURL)
    const data = await jsonData.json()
    console.log(data)

    

    // gameIdsArray = data.events.map(gameId => {
    //     thisId = gameId.id
    //     gameIdsArray.push(thisId)
      
    // }) 

    let gamesList = data.events.map(score => {
            
        thisGameId = score.id
        const gameName = score.name
        const awayScore = score.competitions[0].competitors[1].score
        const homeScore = score.competitions[0].competitors[0].score
        const awayTeamName = score.competitions[0].competitors[1].team.displayName
        const homeTeamName = score.competitions[0].competitors[0].team.displayName
        const awayTeamColor = score.competitions[0].competitors[1].team.color
        const homeTeamColor = score.competitions[0].competitors[0].team.color
        const awayLogo = score.competitions[0].competitors[1].team.logo
        const homeLogo = score.competitions[0].competitors[0].team.logo
        
        
        let awayTeamScore = document.getElementById("awayTeamScore")
        awayTeamScore.style.background = `#${awayTeamColor}`
        
        let homeTeamScore = document.getElementById("homeTeamScore")
        homeTeamScore.style.background = `#${homeTeamColor}`
        
        return `
        <section id="eventsContainer">
        <div id="gameTime">${score.status.type.detail}</div>
        <div id="awayTeamScore" style=background:#${awayTeamColor};><img src="${awayLogo}" width="25" height="25" align="center" style=padding:5px; background:white; margin:4px;>${awayTeamName} ${awayScore}</div>
        <div id="homeTeamScore" style=background:#${homeTeamColor};><img src="${homeLogo}" width="25" height="25" align="center" style=padding:5px; background:white; margin:4px;>${homeTeamName} ${homeScore}</div>
        <button id="btn" data="${thisGameId}">Go To Game</button></div>
        </section>
        `
    })
    
    const theGames = document.getElementById('eventsContainer')
    theGames.innerHTML = gamesList.join('')
}
const scrollToTop = () => {
    window.scrollTo({
      top: 0
    });
  }

document.querySelectorAll("#eventsContainer").forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        thisGameId = e.target.lastChild.parentNode.attributes.data.nodeValue
        gameUrl =  `http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${thisGameId}`
        console.log(gameUrl)
        let clickedGame = document.querySelectorAll('#gameInfoContainer')
        clickedGame.innerHTML = renderClickedGame()
        clickedGame.innerHTML = scrollToTop()
        
        
        
        
    });
    
});


// get theGame and fetch everything to show the clicked game
  
fetchScoreboard()


const renderClickedGame = () => 
{
    
    const displayData = async () => {
        const jsonData = await fetch (gameUrl)
        const data = await jsonData.json()
        console.log(data) 

   
    
    // game info container //
    const gameId = data.header.competitions.id
    const awayTeamRecord = data.header.competitions[0].competitors[1].record[0].displayValue
    const homeTeamRecord = data.header.competitions[0].competitors[0].record[0].displayValue
    const awayTeamName = data.header.competitions[0].competitors[1].team.displayName
    const homeTeamName = data.header.competitions[0].competitors[0].team.displayName
    const awayTeamName1 = data.header.competitions[0].competitors[1].team.location
    const homeTeamName1 = data.header.competitions[0].competitors[0].team.location
    const awayTeamAbbrev = data.header.competitions[0].competitors[1].team.abbreviation
    const homeTeamAbbrev = data.header.competitions[0].competitors[0].team.abbreviation
    let awayRank = data.header.competitions[0].competitors[1].rank
    let homeRank = data.header.competitions[0].competitors[0].rank
    let awayScore = data.header.competitions[0].competitors[1].score
    let homeScore = data.header.competitions[0].competitors[0].score
    const weekNumber = data.header.week
    const awayTeamColor = data.boxscore.teams[0].team.color
    const homeTeamColor = data.boxscore.teams[1].team.color
    const alternateAwayTeamColor = data.boxscore.teams[0].team.alternateColor
    const alternateHomeTeamColor = data.boxscore.teams[1].team.alternateColor
    let awayLogo = data.header.competitions[0].competitors[1].team.logos[1].href
    let homeLogo = data.header.competitions[0].competitors[0].team.logos[1].href
    let awayDarkLogo = data.header.competitions[0].competitors[1].team.logos[0].href
    let homeDarkLogo = data.header.competitions[0].competitors[0].team.logos[0].href
    let venueName = data.gameInfo.venue.fullName
    let venueCity = data.gameInfo.venue.address.city
    let venueState = data.gameInfo.venue.address.state

    //let currentDrive = dataives.current.description
    homeScoreInt = parseInt(homeScore)
    awayScoreInt = parseInt(awayScore)
    
    if (awayScore === undefined) 
    awayScore = 0
    
    if (homeScore === undefined)
    homeScore = 0
        
    // weather - conditional statements by precip chances //
    
    if (data.header.competitions[0].status.type.completed === false || data.header.competitions[0].status.type.description === false){
      if (data.gameInfo.weather === undefined) { 
        document.getElementById('weather').style.display = 'none'
       } else {
    let weatherTemp = data.gameInfo.weather.temperature
    let weatherPrecip = data.gameInfo.weather.precipitation
    let weatherTeamHigh = data.gameInfo.weather.highTemperature
    let weatherTempLow = data.gameInfo.weather.lowTemperature
      
    switch (true)  {

        case (data.header.competitions[0].status.type.description === "Scheduled" && weatherPrecip >= 0 && weatherPrecip < 20):
        weather = document.getElementById('weather')
        weather.innerHTML = `${weatherTeamHigh}&#176` 
        weather.style.color = `#${homeTeamColor}`
        break;

        case (data.header.competitions[0].status.type.description === "Scheduled" && weatherPrecip > 50 && weatherPrecip > 20):
        weather = document.getElementById('weather')
        weather.innerHTML = `${weatherTeamHigh}&#176`  
        weather.style.color = `#${homeTeamColor}`
        break;

        case (data.header.competitions[0].status.type.description === "Scheduled" && weatherPrecip > 50 && weatherPrecip < 70):
        weather = document.getElementById('weather')
        weather.innerHTML = `${weatherTeamHigh}&#176`  
        weather.style.color = `#${homeTeamColor}`
        break;

        case (data.header.competitions[0].status.type.description === "Scheduled" && weatherPrecip > 70):
        weather = document.getElementById('weather')
        weather.innerHTML = `${weatherTeamHigh}&#176`
        weather.style.color = `#${homeTeamColor}`
        break;

            case (weatherPrecip >= 0 && weatherPrecip < 20):
                weather = document.getElementById('weather')
                weather.innerHTML = `${weatherTemp}&#176  &#x1F324`
                weather.style.color = `#${homeTeamColor}`
                break;

            case (weatherPrecip > 20 && weatherPrecip < 50):
                weather = document.getElementById('weather')
                weather.innerHTML = `${weatherTemp}&#176  &#x1F326`
                weather.style.color = `#${homeTeamColor}`
                break;

            case (weatherPrecip > 50 && weatherPrecip < 70):
            weather = document.getElementById('weather')
            weather.innerHTML = `${weatherTemp}&#176  &#x1F327`
            weather.style.color = `#${homeTeamColor}`
            break;

            case (weatherPrecip > 70):
            weather = document.getElementById('weather')
            weather.innerHTML = `${weatherTemp}&#176  &#x1F327`
            weather.style.color = `#${homeTeamColor}`
            break;

        
    
        default:
            break;
    
    }
  } 
}

const showBroadcastNetwork = () => 
    {
        const secNetworkLogo = 'images/sec-network-logo-removebg-preview.png'
        const espnLogo = 'images/espn-logo.png' 
        const espnULogo = 'images/espnu-logo.png'
        const cbsLogo = 'images/sec-on-cbs-logo.png'
        const nbcLogo = 'images/nbc-logo.png'
        const abcLogo = 'images/abc-logo.png'
        const foxLogo = 'images/fox.png'
        const bigTenNetworkLogo = 'images/bigTen.png'
    
        const cbsSportsNetwork = 'CBSSN'
        const secNetwork = 'SECN'
        const espn = 'ESPN'
        const fox = 'FOX'
        const espnU = 'ESPNU'
        const cbs = 'CBS'
        const nbc = 'NBC'
        const abc = 'ABC'
        const bigTenNetwork = 'BTN'
    
        // One option needs to be if no image... just do name of network
    
    switch (data?.header?.competitions[0]?.broadcasts[0]?.media?.shortName) 
    
    {
        case secNetwork:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${secNetworkLogo}" width="125" height="75" align="center"></div>`
            break;
        case espn:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${espnLogo}" width="125" height="75" align="center"></div>`
            break;
        case espnU:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${espnULogo}" width="125" height="75" align="center"></div>`
            break;
        case cbs:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${cbsLogo}" width="125" height="75" align="center"></div>`
            break;
        case nbc:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${nbcLogo}" width="125" height="75" align="center"></div>`
            break;
        case abc:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${abcLogo}" width="100" height="100" align="center"></div>`
            break;
        case fox:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${foxLogo}" width="125" height="75" align="center"></div>`
            break;
        case bigTenNetwork:
            document.getElementById('gameDescription').innerHTML = `<div><img src="${bigTenNetworkLogo}" width="125" height="75" align="center"></div>`
            break; 
    
        default:
            break;
    }
}


    // VENUE // 
    const venue = document.getElementById('venue')
    venue.innerHTML = `<img src="${awayLogo}" width="75" height="75" align="center"> ${venueName} ${venueCity}, ${venueState} <img src="${homeLogo}" width="75" height="75" align="center">`
    venue.style.backgroundColor = `rgba(0, 0, 0, 0.767)`

    // // BROADCAST INFO / TV INFO //
    // if (data.header.competitions[0].broadcasts[0] !== undefined) {
    // const gameDescription = document.getElementById('gameDescription')
    // gameDescription.innerHTML = `Broadcast Live On ${data.header.competitions[0].broadcasts[0].media.shortName}`
    // }

    // GAME STATUS //
    const gameStatus = document.getElementById('gameStatus')
    gameStatus.innerHTML = `<div align="center">${data.header.competitions[0].status.type.detail}</div>`
    gameStatus.style.backgroundColor = `rgba(0, 0, 0, 0.767)`

        
    
    // MAIN SCORE/MATCHUP GRAPHIC - AWAY TEAM, HOME TEAM, RANKING, RECORD, ETC // 
   

    if (awayRank === undefined) {
    const awayTeam = document.getElementById('awayTeam')
    awayTeam.innerHTML = `(${awayTeamRecord}) <img src="${awayLogo}" width="75" height="75" align="center"> ${awayTeamName} ${awayScore}`
    awayTeam.style.backgroundColor = `#${awayTeamColor}`
    awayTeam.style.color = `contrast(#${awayTeamColor}, #101010)`;

    } else {
    const awayTeam = document.getElementById('awayTeam')
    awayTeam.innerHTML = `(${awayTeamRecord}) <img src="${awayLogo}" width="75" height="75" align="center"> ${awayRank} ${awayTeamName} ${awayScore}`
    awayTeam.style.backgroundColor = `#${awayTeamColor}`
    awayTeam.style.color = `contrast(#${awayTeamColor}, #101010)`;
    }

    if (homeRank === undefined) {
    const homeTeam = document.getElementById('homeTeam')
    homeTeam.innerHTML = `(${homeTeamRecord}) <img src="${homeLogo}" width="75" height="75" align="center"> ${homeTeamName} ${homeScore}`
    homeTeam.style.backgroundColor = `#${homeTeamColor}`
    homeTeam.style.color = `contrast(#${homeTeamColor}, #101010)`;
    } else {
    const homeTeam = document.getElementById('homeTeam')
    homeTeam.innerHTML = `(${homeTeamRecord}) <img src="${homeLogo}" width="75" height="75" align="center"> ${homeRank} ${homeTeamName} ${homeScore}`
    homeTeam.style.backgroundColor = `#${homeTeamColor}`
    homeTeam.style.color = `contrast(#${homeTeamColor}, #101010)`;
    }

    // plays container //  
    if (data.drives === undefined) {
        document.getElementById('currentPlay').style.display = 'none'; 
    } else {
    if (data.header.competitions[0].status.type.completed === false || data.header.competitions[0].status.type.description === false) {
       
        let theDownDistance = []
        function getDownDistance() {
        let currentDownDistance = data.drives.current.plays.pop();
        theDownDistance.push(currentDownDistance.end.downDistanceText)
       
           return theDownDistance
    }
    
    if (data.drives === undefined) {
        document.getElementById('currentPlay').style.display = 'none'; 

    } else {
        if (data.header.competitions[0].status.type.completed === false) {   
        let currentPlay = []
        function getLastPlay() {
        let lastPlay = data.drives.current.plays.pop();
        currentPlay.push(lastPlay.text)
            return currentPlay      
        }
    }
}


        if (data.drives === undefined) {
            document.getElementById('currentPlay').style.display = 'none'; 

        } else {
            if (data.header.competitions[0].status.type.completed === false && data.header.competitions[0].status.type.description !== "Scheduled" && data.drives.current.team.logos[0].href !== undefined) {
                driveTeam = data.drives.current.team.logos[0].href
                const theLastPlay = document.getElementById('currentPlay')
                theLastPlay.innerHTML = `${getLastPlay()}`
                   
        const theDownDistanceIs = document.getElementById('theDownDistanceIs')
        theDownDistanceIs.innerHTML = `<img src=${driveTeam} width="75" height="75" align="center"> ${getDownDistance()}`
        //**wcurrent drive info added** theDownDistanceIs.innerHTML = `<img src=${driveTeam} width="75" height="75"> ${getDownDistance()} - (${currentDrive})`

        }
    }
    
    
        
        // scoring and other events (TD, FG, Penalties, etc) //
        // touchdown // 
        if (data.header.competitions[0].status.type.completed === false && data.header.competitions[0].status.type.description !== "Scheduled" && data.drives.current.result === "TD") 
        {
        
            venuePhoto.style.display = 'none'
            touchdownEvent = data.drives.current.team.displayName
            touchdown = document.getElementById('touchdown')
            touchdown.innerHTML =  `TOUCHDOWN <br> <img src="${driveTeam}" width="250" height="250">`
        }
        
         // slow fade/flash background behind touchdown message // 
         if (data.drives.current.result === "TD")
         {
            var ofs = 0;
            var el = document.getElementById('touchdown');
            
            window.setInterval(function(){
                el.style.background = `rgba(0,0,0,${Math.abs(Math.sin(ofs))})`;
                ofs += 0.01;
            
            }, 10);
        }
    
        
       


    // if data.header.competitions[0].competitors[0].winner === true, do something
    // function then render it and stuff logo.innerHTML = 
    
    // if (logo.header.competitions[0].competitors[0].possession === true) {      
     
    }
} 
// scoring plays //
if (data.header.competitions[0].status.type.completed === false && data.header.competitions[0].status.type.description !== "Scheduled" && data.scoringPlays !== undefined) {
const thePlays = data.scoringPlays.map((play) => {
    
    return `
    <div id="scoringPlays" align="left">${play.team.abbreviation} - ${play.text} | QTR${play.period.number} | ${play.clock.displayValue} | <img src="${awayDarkLogo}"width="40" height="40" align="center">  ${play.awayScore} - ${play.homeScore}  <img src="${homeDarkLogo}"width="40" height="40" align="center"></div>
    `
})


 // FOR ALL STATS HEADSHOTS, GET GENERIC GRAPHIC TO TAKE PLACE OF HEADSHOT IF HEADSHOT IS NULL
const scoringPlays = document.getElementById('scoringPlaysContainer')
    scoringPlays.innerHTML = thePlays.join('')
}   
    
    if (data.leaders !== [] ) {
        let homePassingLeader = data?.leaders[0]?.leaders[0]?.leaders[0]?.athlete?.displayName
        let homePassingLeaderHeadshot = data?.leaders[0]?.leaders[0]?.leaders[0]?.athlete?.headshot?.href
        let homePassingLeaderStats = data?.leaders[0]?.leaders[0]?.leaders[0]?.displayValue
        let homePassingLeaderJersey = data?.leaders[0]?.leaders[0]?.leaders[0]?.athlete?.jersey
        let homePassingLeaderPosition = data?.leaders[0]?.leaders[0]?.leaders[0]?.athlete?.position?.abbreviation
        
        let awayPassingLeader = data?.leaders[1]?.leaders[0]?.leaders[0]?.athlete?.displayName
        let awayPassingLeaderHeadshot = data?.leaders[1]?.leaders[0]?.leaders[0]?.athlete?.headshot?.href
        let awayPassingLeaderStats = data?.leaders[1]?.leaders[0]?.leaders[0]?.displayValue
        let awayPassingLeaderJersey = data?.leaders[1]?.leaders[0]?.leaders[0]?.athlete?.jersey
        let awayPassingLeaderPosition = data?.leaders[1]?.leaders[0]?.leaders[0]?.athlete?.position?.abbreviation
        const alternateHeadshot = 'images/headshot_alternate.png'
        
        // Alternate Home Passing headshot photo logic ******* DOES NOT WORK CURRENTLY
        if (homePassingLeaderHeadshot === null || homePassingLeaderHeadshot === undefined || !homePassingLeaderHeadshot)
        {
            const homePassingLeaders = document.getElementById('homePassingLeader')
            homePassingLeaders.innerHTML = `${homeTeamName} Stats <br><img src="${alternateHeadshot}" width="100" height="100"> ${homePassingLeaderPosition}${homePassingLeaderJersey}`
            homePassingLeaders.style.color = `#${homeTeamColor}`
        }
        else
        {
            const homePassingLeaders = document.getElementById('homePassingLeader')
            homePassingLeaders.innerHTML = `${homeTeamName} Stats <br><img src="${homePassingLeaderHeadshot}" width="100" height="100"> ${homePassingLeaderPosition}${homePassingLeaderJersey}`
            homePassingLeaders.style.color = `#${homeTeamColor}`
            
        }
        // Alternate Away Passing headshot photo logic ******* DOES NOT WORK CURRENTLY
        if (awayPassingLeaderHeadshot === null || awayPassingLeaderHeadshot === undefined || !awayPassingLeaderHeadshot || awayPassingLeaderHeadshot === 'http://127.0.0.1:8080/undefined')
        {
            
            const awayPassingLeaders = document.getElementById('awayPassingLeader')
            awayPassingLeaders.innerHTML = `${awayTeamName} Stats <br><img src="${alternateHeadshot}" width="100" height="100"> ${awayPassingLeaderPosition}${awayPassingLeaderJersey}`
            awayPassingLeaders.style.color = `#${awayTeamColor}`
        }
        else 
        {
            const awayPassingLeaders = document.getElementById('awayPassingLeader')
            awayPassingLeaders.innerHTML = `${awayTeamName} Stats <br><img src="${awayPassingLeaderHeadshot}" width="100" height="100"> ${awayPassingLeaderPosition}${awayPassingLeaderJersey}`
            awayPassingLeaders.style.color = `#${awayTeamColor}`
            
        }
        const homeStatsContainer = document.getElementById('homeStatsContainer')
        homeStatsContainer.style.border = `2pt solid #${homeTeamColor}`
        
        const awayStatsContainer = document.getElementById('awayStatsContainer')
        awayStatsContainer.style.border = `2pt solid #${awayTeamColor}`
        
        
        const homePassingStats = document.getElementById('homePassingStats')
        homePassingStats.innerHTML = `${homePassingLeader} <br> ${homePassingLeaderStats}`
        homePassingStats.style.backgroundColor = `#${homeTeamColor}`
        
        const awayPassingLeaders = document.getElementById('awayPassingLeader')
        awayPassingLeaders.innerHTML = `${awayTeamName} Stats <br><img src="${awayPassingLeaderHeadshot}" width="100" height="100"> ${awayPassingLeaderPosition}${awayPassingLeaderJersey}`
        awayPassingLeaders.style.color = `#${awayTeamColor}`
        
        const awayPassingStats = document.getElementById('awayPassingStats')
        awayPassingStats.innerHTML = `${awayPassingLeader} <br> ${awayPassingLeaderStats}`
        awayPassingStats.style.backgroundColor = `#${awayTeamColor}`
        }
        
        // Rushing stats container //
        if (data.leaders !== []) {
        let homeRushingLeader = data.leaders[0]?.leaders[1]?.leaders[0]?.athlete.displayName
        let homeRushingLeaderHeadshot = data.leaders[0]?.leaders[1]?.leaders[0]?.athlete?.headshot?.href
        let homeRushingLeaderStats = data.leaders[0]?.leaders[1]?.leaders[0]?.displayValue
        let homeRushingLeaderJersey = data.leaders[0]?.leaders[1]?.leaders[0]?.athlete.jersey
        let homeRushingLeaderPosition = data.leaders[0]?.leaders[1]?.leaders[0]?.athlete.position.abbreviation
        
        let awayRushingLeader = data.leaders[1]?.leaders[1]?.leaders[0]?.athlete.displayName
        let awayRushingLeaderHeadshot = data.leaders[1]?.leaders[1]?.leaders[0]?.athlete?.headshot?.href
        let awayRushingLeaderStats = data.leaders[1]?.leaders[1]?.leaders[0]?.displayValue
        let awayRushingLeaderJersey = data.leaders[1]?.leaders[1]?.leaders[0]?.athlete.jersey
        let awayRushingLeaderPosition = data.leaders[1]?.leaders[1]?.leaders[0]?.athlete.position.abbreviation
        
        const homeRushingLeaders = document.getElementById('homeRushingLeader')
        homeRushingLeaders.innerHTML = `<img src="${homeRushingLeaderHeadshot}" width="100" height="100"> ${homeRushingLeaderPosition}${homeRushingLeaderJersey}`
        homeRushingLeaders.style.color = `#${homeTeamColor}`
        
        const homeRushingStats = document.getElementById('homeRushingStats')
        homeRushingStats.innerHTML = `${homeRushingLeader} <br> ${homeRushingLeaderStats}`
        homeRushingStats.style.backgroundColor = `#${homeTeamColor}`
        
        const awayRushingLeaders = document.getElementById('awayRushingLeader')
        awayRushingLeaders.innerHTML = `<img src="${awayRushingLeaderHeadshot}" width="100" height="100"> ${awayRushingLeaderPosition}${awayRushingLeaderJersey}`
        awayRushingLeaders.style.color = `#${awayTeamColor}`
        
        const awayRushingStats = document.getElementById('awayRushingStats')
        awayRushingStats.innerHTML = `${awayRushingLeader} <br> ${awayRushingLeaderStats}`
        awayRushingStats.style.backgroundColor = `#${awayTeamColor}`
        }
        // Receiving stats container //
        if (data.leaders !== [] || data.leaders !== undefined || data.leaders[0] !== []) {
        let homeReceivingLeader = data.leaders[0].leaders[2].leaders[0].athlete.displayName
        
        let homeReceivingLeaderStats = data.leaders[0].leaders[2].leaders[0].displayValue
        let homeReceivingLeaderJersey = data.leaders[0].leaders[2].leaders[0].athlete.jersey
        let homeReceivingLeaderPosition = data.leaders[0].leaders[2].leaders[0].athlete.position.abbreviation
        
        let awayReceivingLeader = data.leaders[1].leaders[2].leaders[0].athlete.displayName
        let awayReceivingLeaderStats = data.leaders[1].leaders[2].leaders[0].displayValue
        let awayReceivingLeaderJersey = data.leaders[1].leaders[2].leaders[0].athlete.jersey
        let awayReceivingLeaderPosition = data.leaders[1].leaders[2].leaders[0].athlete.position.abbreviation  
        
        
    if (data.leaders[0].leaders[2].leaders[0].athlete.headshot === undefined) {   
        const homeReceivingLeaders = document.getElementById('homeReceivingLeader')
        homeReceivingLeaders.style.color = `#${homeTeamColor}`
        homeReceivingLeaders.style.height = '107px'

        } else {
            let homeReceivingLeaderHeadshot = data.leaders[0].leaders[2].leaders[0].athlete.headshot.href
            const homeReceivingLeaders = document.getElementById('homeReceivingLeader')
            homeReceivingLeaders.innerHTML = `<img src="${homeReceivingLeaderHeadshot}" width="100" height="100"> ${homeReceivingLeaderPosition}${homeReceivingLeaderJersey}`
            homeReceivingLeaders.style.color = `#${homeTeamColor}`

        }
    
        
        const homeReceivingStats = document.getElementById('homeReceivingStats')
        homeReceivingStats.innerHTML = `${homeReceivingLeader} <br> ${homeReceivingLeaderStats}`
        homeReceivingStats.style.backgroundColor = `#${homeTeamColor}`
        
        if (data.leaders[1].leaders[2].leaders[0].athlete.headshot === undefined) {
            const awayReceivingLeaders = document.getElementById('awayReceivingLeader')
            awayReceivingLeaders.style.color = `#${awayTeamColor}`
            awayReceivingLeaders.style.marginTop = "76px"
            awayReceivingLeaders.style.height = '107px'


        
        } else {
        
        const awayReceivingLeaders = document.getElementById('awayReceivingLeader')
        let awayReceivingLeaderHeadshot = data.leaders[1].leaders[2].leaders[0].athlete.headshot.href
        awayReceivingLeaders.innerHTML = `<img src="${awayReceivingLeaderHeadshot}" width="100" height="100"> ${awayReceivingLeaderPosition}${awayReceivingLeaderJersey}`
        awayReceivingLeaders.style.color = `#${awayTeamColor}`
        }
        
        const awayReceivingStats = document.getElementById('awayReceivingStats')
        awayReceivingStats.innerHTML = `${awayReceivingLeader} <br> ${awayReceivingLeaderStats}`
        awayReceivingStats.style.backgroundColor = `#${awayTeamColor}`
        }
    
    // end of game //
   //***********************//
   
   if (data.header.competitions[0].status.type.description === "Final") {  
    
    if (awayRank === undefined && homeRank === undefined){
        awayRank = ''
        homeRank = ''
    }

    if (awayRank === undefined) {
        awayRank = 26
    } 
        if (homeRank === undefined) {
            homeRank = 26
        
    }

           // scoring plays END OF GAME//
if (data.header.competitions[0].status.type.completed === true && data.header.competitions[0].status.type.description !== "Scheduled") {
    const thePlays = data.scoringPlays.map((play) => {
       let scoringTeam = play.team.abbreviation 
        return `
        <div id="scoringPlays" align="left">${scoringTeam} - ${play.text} | QTR${play.period.number} | ${play.clock.displayValue} | <img src="${awayDarkLogo}"width="40" height="40" align="center">  ${play.awayScore} - ${play.homeScore}  <img src="${homeDarkLogo}"width="40" height="40" align="center"></div>
        `
    })
    
    
    
    const scoringPlays = document.getElementById('scoringPlaysContainer')
        scoringPlays.innerHTML = thePlays.join('')
    }   

    switch (true) {
        case(awayScoreInt > homeScoreInt && awayRank > homeRank):
         awayWinner = document.getElementById('winner') 
         awayWinner.innerHTML =`UPSET!!! <br> <img src="${awayLogo}" width="250 height="250"><br>${awayScoreInt} - ${homeScoreInt}`
         venuePhoto.style.display = 'none'
         venue.innerHTML =  `FINAL <hr><img src="${awayLogo}" width='40' height='40' align='center'>${awayScoreInt} - ${homeScoreInt}<img src='${homeLogo}' width='40' height='40' align='center'>`
         venue.style.background = `#${awayTeamColor}`
 
        var ofs2 = 0;
        var el2 = document.getElementById('winner');
        window.setInterval(function(){
            el2.style.background = `rgba(0,0,0,${Math.abs(Math.sin(ofs2))})`;
            ofs2 += 0.01;
        }, 10);
            break; 

        case(awayScoreInt > homeScoreInt && awayRank <= homeRank):
         awayWinner = document.getElementById('winner') 
         awayWinner.innerHTML =`WINNER <br> <img src="${awayLogo}" width="250 height="250"><br>${awayScoreInt} - ${homeScoreInt}`
         venuePhoto.style.display = 'none'
         venue.innerHTML =  `FINAL <hr><img src="${awayLogo}" width='40' height='40' align='center'>${awayScoreInt} - ${homeScoreInt}<img src='${homeLogo}' width='40' height='40' align='center'>`
         venue.style.background = `#${awayTeamColor}`

        // var ofs2 = 0;
        // var el2 = document.getElementById('winner');
        window.setInterval(function(){
            el2.style.background = `rgba(0,0,0,${Math.abs(Math.sin(ofs2))})`;
            ofs2 += 0.01;
        }, 10);
            break; 

         
        case(homeScoreInt > awayScoreInt && homeRank > awayRank):
        homeWinner = document.getElementById('winner') 
        homeWinner.innerHTML =`UPSET!!! <br> <img src="${homeLogo}" width="250 height="250"><br>${homeScoreInt} - ${awayScoreInt}`
        venuePhoto.style.display = 'none'
        venue.innerHTML =  `FINAL <hr><img src="${awayLogo}" width='40' height='40' align='center'>${awayScoreInt} - ${homeScoreInt}<img src='${homeLogo}' width='40' height='40' align='center'>`

        // var ofs2 = 0;
        // var el2 = document.getElementById('winner');
     
         window.setInterval(function(){
         el2.style.background = `rgba(0,0,0,${Math.abs(Math.sin(ofs2))})`;
         ofs2 += 0.01;
         }, 10);
         break;

         case(homeScoreInt > awayScoreInt && homeRank <= awayRank):
        homeWinner = document.getElementById('winner') 
        homeWinner.innerHTML =`WINNER <br> <img src="${homeLogo}" width="250 height="250"><br>${homeScoreInt} - ${awayScoreInt}`
        venuePhoto.style.display = 'none'
        var ofs2 = 0;
        var el2 = document.getElementById('winner');
        venue.innerHTML =  `FINAL <hr><img src="${awayLogo}" width='40' height='40' align='center'>${awayScoreInt} - ${homeScoreInt} <img src='${homeLogo}' width='40' height='40' align='center'>`

     
         window.setInterval(function(){
         el2.style.background = `rgba(0,0,0,${Math.abs(Math.sin(ofs2))})`;
         ofs2 += 0.01;
         }, 20);
         break;
            
            default:
                break     

}
 
}

//post-game stats 
// passing stats container //
if (data.leaders !== []) {
    let homePassingLeader = data.leaders[0].leaders[0].leaders[0].athlete.displayName
    let homePassingLeaderHeadshot = data.leaders[0].leaders[0].leaders[0].athlete.headshot.href
    let homePassingLeaderStats = data.leaders[0].leaders[0].leaders[0].displayValue
    let homePassingLeaderJersey = data.leaders[0].leaders[0].leaders[0].athlete.jersey
    let homePassingLeaderPosition = data.leaders[0].leaders[0].leaders[0].athlete.position.abbreviation
    
    let awayPassingLeader = data.leaders[1].leaders[0].leaders[0].athlete.displayName
    let awayPassingLeaderHeadshot = data.leaders[1].leaders[0].leaders[0].athlete.headshot.href
    let awayPassingLeaderStats = data.leaders[1].leaders[0].leaders[0].displayValue
    let awayPassingLeaderJersey = data.leaders[1].leaders[0].leaders[0].athlete.jersey
    let awayPassingLeaderPosition = data.leaders[1].leaders[0].leaders[0].athlete.position.abbreviation
    
    const homeStatsContainer = document.getElementById('homeStatsContainer')
    homeStatsContainer.style.border = `2pt solid #${homeTeamColor}`
    
    const awayStatsContainer = document.getElementById('awayStatsContainer')
    awayStatsContainer.style.border = `2pt solid #${awayTeamColor}`
    
    const homePassingLeaders = document.getElementById('homePassingLeader')
    homePassingLeaders.innerHTML = `${homeTeamName} Stats <br><img src="${homePassingLeaderHeadshot}" width="100" height="100"> ${homePassingLeaderPosition}${homePassingLeaderJersey}`
    homePassingLeaders.style.color = `#${homeTeamColor}`
    
    const homePassingStats = document.getElementById('homePassingStats')
    homePassingStats.innerHTML = `${homePassingLeader} <br> ${homePassingLeaderStats}`
    homePassingStats.style.backgroundColor = `#${homeTeamColor}`
    
    const awayPassingLeaders = document.getElementById('awayPassingLeader')
    awayPassingLeaders.innerHTML = `${awayTeamName} Stats <br><img src="${awayPassingLeaderHeadshot}" width="100" height="100"> ${awayPassingLeaderPosition}${awayPassingLeaderJersey}`
    awayPassingLeaders.style.color = `#${awayTeamColor}`
    
    const awayPassingStats = document.getElementById('awayPassingStats')
    awayPassingStats.innerHTML = `${awayPassingLeader} <br> ${awayPassingLeaderStats}`
    awayPassingStats.style.backgroundColor = `#${awayTeamColor}`
    }
    
    // Rushing stats container //
    if (data.leaders !== []) {
    let homeRushingLeader = data.leaders[0].leaders[1].leaders[0].athlete.displayName
    let homeRushingLeaderHeadshot = data.leaders[0].leaders[1].leaders[0].athlete.headshot.href
    let homeRushingLeaderStats = data.leaders[0].leaders[1].leaders[0].displayValue
    let homeRushingLeaderJersey = data.leaders[0].leaders[1].leaders[0].athlete.jersey
    let homeRushingLeaderPosition = data.leaders[0].leaders[1].leaders[0].athlete.position.abbreviation
    
    let awayRushingLeader = data.leaders[1].leaders[1].leaders[0].athlete.displayName
    let awayRushingLeaderHeadshot = data.leaders[1].leaders[1].leaders[0].athlete.headshot.href
    let awayRushingLeaderStats = data.leaders[1].leaders[1].leaders[0].displayValue
    let awayRushingLeaderJersey = data.leaders[1].leaders[1].leaders[0].athlete.jersey
    let awayRushingLeaderPosition = data.leaders[1].leaders[1].leaders[0].athlete.position.abbreviation
    
    const homeRushingLeaders = document.getElementById('homeRushingLeader')
    homeRushingLeaders.innerHTML = `<img src="${homeRushingLeaderHeadshot}" width="100" height="100"> ${homeRushingLeaderPosition}${homeRushingLeaderJersey}`
    homeRushingLeaders.style.color = `#${homeTeamColor}`
    
    const homeRushingStats = document.getElementById('homeRushingStats')
    homeRushingStats.innerHTML = `${homeRushingLeader} <br> ${homeRushingLeaderStats}`
    homeRushingStats.style.backgroundColor = `#${homeTeamColor}`
    
    const awayRushingLeaders = document.getElementById('awayRushingLeader')
    awayRushingLeaders.innerHTML = `<img src="${awayRushingLeaderHeadshot}" width="100" height="100"> ${awayRushingLeaderPosition}${awayRushingLeaderJersey}`
    awayRushingLeaders.style.color = `#${awayTeamColor}`
    
    const awayRushingStats = document.getElementById('awayRushingStats')
    awayRushingStats.innerHTML = `${awayRushingLeader} <br> ${awayRushingLeaderStats}`
    awayRushingStats.style.backgroundColor = `#${awayTeamColor}`
    }
    // Receiving stats container //
    if (data.leaders !== []) {
    let homeReceivingLeader = data.leaders[0].leaders[2].leaders[0].athlete.displayName
    let homeReceivingLeaderStats = data.leaders[0].leaders[2].leaders[0].displayValue
    let homeReceivingLeaderJersey = data.leaders[0].leaders[2].leaders[0].athlete.jersey
    let homeReceivingLeaderPosition = data.leaders[0].leaders[2].leaders[0].athlete.position.abbreviation
    
    let awayReceivingLeader = data.leaders[1].leaders[2].leaders[0].athlete.displayName
    let awayReceivingLeaderStats = data.leaders[1].leaders[2].leaders[0].displayValue
    let awayReceivingLeaderJersey = data.leaders[1].leaders[2].leaders[0].athlete.jersey
    let awayReceivingLeaderPosition = data.leaders[1].leaders[2].leaders[0].athlete.position.abbreviation
    
    if (data.leaders[0].leaders[2].leaders[0].athlete.headshot === undefined) {   
        const homeReceivingLeaders = document.getElementById('homeReceivingLeader')
        homeReceivingLeaders.style.color = `#${homeTeamColor}`
        homeReceivingLeaders.style.height = '107px'
        
        
        } else {
            let homeReceivingLeaderHeadshot = data.leaders[0].leaders[2].leaders[0].athlete.headshot.href
            const homeReceivingLeaders = document.getElementById('homeReceivingLeader')
            homeReceivingLeaders.innerHTML = `<img src="${homeReceivingLeaderHeadshot}" width="100" height="100"> ${homeReceivingLeaderPosition}${homeReceivingLeaderJersey}`
            homeReceivingLeaders.style.color = `#${homeTeamColor}`
        }
        
        const homeReceivingStats = document.getElementById('homeReceivingStats')
        homeReceivingStats.innerHTML = `${homeReceivingLeader} <br> ${homeReceivingLeaderStats}`
        homeReceivingStats.style.backgroundColor = `#${homeTeamColor}`
        
        if (data.leaders[1].leaders[2].leaders[0].athlete.headshot === undefined) {
            const awayReceivingLeaders = document.getElementById('awayReceivingLeader')
            awayReceivingLeaders.innerHTML = `${awayReceivingLeaderPosition}${awayReceivingLeaderJersey}`
        awayReceivingLeaders.style.color = `#${awayTeamColor}`
        awayReceivingLeaders.style.marginTop = "76px"
        awayReceivingLeaders.style.height = '107px'

        
        } else {
        
        const awayReceivingLeaders = document.getElementById('awayReceivingLeader')
        let awayReceivingLeaderHeadshot = data.leaders[1].leaders[2].leaders[0].athlete.headshot.href
        awayReceivingLeaders.innerHTML = `<img src="${awayReceivingLeaderHeadshot}" width="100" height="100"> ${awayReceivingLeaderPosition}${awayReceivingLeaderJersey}`
        awayReceivingLeaders.style.color = `#${awayTeamColor}`
        }
        
        const awayReceivingStats = document.getElementById('awayReceivingStats')
        awayReceivingStats.innerHTML = `${awayReceivingLeader} <br> ${awayReceivingLeaderStats}`
        awayReceivingStats.style.backgroundColor = `#${awayTeamColor}`
        }

    
        showBroadcastNetwork()
    } 
 
    displayData()
   
} 



   