

async function computeAverageMission(date) {
  const API_AUTHORS_URL = 'https://beta.gouv.fr/api/v2.3/authors.json'

  const axios = require('axios')
    console.log('Compute average mission run')
    let members = await axios
        .get(API_AUTHORS_URL)
        .then((response) => response.data)
    members = members.map((author) => {
      if (author.missions && author.missions.length > 0) {
              const sortedStartDates = author.missions.map((x) => x.start).sort();
              const sortedEndDates = author.missions
                .map((x) => x.end || '')
                .sort()
                .reverse();
              const latestMission = author.missions.reduce((a, v) =>
                v.end > a.end || !v.end ? v : a
              );
  
              [author.start] = sortedStartDates;
              author.end = sortedEndDates.includes('') ? '' : sortedEndDates[0];
              author.employer = latestMission.status
                ? `${latestMission.status}/${latestMission.employer}`
                : latestMission.employer;
            }
            return author;
        })
        // retire les membres sans missions
        .filter(member => member.missions)
        // retire les missions qui commence après la date passée en param
        .map(member => {
            return {
                ...member,
                missions: member.missions.filter(mission => ! (new Date(mission.start) > date))
            }
        })
        // retire les membres qui n'ont plus de missions ayant passées les filtres
        .filter(member => member.missions.length)
        
        const nbMissions = members.map(member => member.missions.length).reduce((a, b) => a + b, 0)
        const nbMembers = members.length
        return {
          nbMembers,
          nbMissions,
          average: parseFloat(nbMissions)/parseFloat(nbMembers)
        }
}


async function computeAverageMissionOvermonth() {
  const month = {
    '01/2022' : await computeAverageMission(new Date('2022/01/01')),
    '02/2022' : await computeAverageMission(new Date('2022/02/01')),
    '03/2022' : await computeAverageMission(new Date('2022/03/01')),
    '04/2022' : await computeAverageMission(new Date('2022/04/01')),
    '05/2022' : await computeAverageMission(new Date('2022/05/01')),
    '06/2022' : await computeAverageMission(new Date('2022/06/01')),
    '07/2022' : await computeAverageMission(new Date('2022/07/01')),
    '08/2022' : await computeAverageMission(new Date('2022/08/01')),
    '09/2022' : await computeAverageMission(new Date('2022/09/01')),
  }
  return month
}
computeAverageMissionOvermonth().then(value => {
  console.log('Nb mission moyenne par personne', value)
})

