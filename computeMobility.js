async function computeMobility(date) {
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
                  missions: member.missions.filter(mission => !(new Date(mission.start) > date))
              }
          })
          // retire les membres qui n'ont plus de missions ayant passées les filtres
          .filter(member => member.missions.length)
          const hasMultipleMissions = (member) => member.missions.length >= 2
          const hasMultipleStartups = (member) => member.startups && member.startups.length >= 2
          const hasPreviously = (member) => member.previously && member.previously.length >= 1
          const membersWithMobility = members.filter(member => (
            hasMultipleMissions(member )||
            hasPreviously(member) ||
            hasMultipleStartups(member)))
          const nbMembers = members.length
          const nbMembersWithMobility = membersWithMobility.length
          return {
            nbMembers,
            nbMembersWithMobility,
            memberWithMobilityPercentage: (parseFloat(nbMembersWithMobility)/parseFloat(nbMembers)) * 100
          }
  }

  async function computeMobilityOvermonth() {
    const month = {
    '01/2021' : await computeMobility(new Date('2021/01/01')),
      '02/2021' : await computeMobility(new Date('2021/02/01')),
      '03/2021' : await computeMobility(new Date('2021/03/01')),
      '04/2021' : await computeMobility(new Date('2021/04/01')),
      '05/2021' : await computeMobility(new Date('2021/05/01')),
      '06/2021' : await computeMobility(new Date('2021/06/01')),
      '07/2021' : await computeMobility(new Date('2021/07/01')),
      '08/2021' : await computeMobility(new Date('2021/08/01')),
      '09/2021' : await computeMobility(new Date('2021/09/01')),
      '10/2021' : await computeMobility(new Date('2021/10/01')),
      '11/2021' : await computeMobility(new Date('2021/11/01')),
      '12/2021' : await computeMobility(new Date('2021/12/01')),
      '01/2022' : await computeMobility(new Date('2022/01/01')),
      '02/2022' : await computeMobility(new Date('2022/02/01')),
      '03/2022' : await computeMobility(new Date('2022/03/01')),
      '04/2022' : await computeMobility(new Date('2022/04/01')),
      '05/2022' : await computeMobility(new Date('2022/05/01')),
      '06/2022' : await computeMobility(new Date('2022/06/01')),
      '07/2022' : await computeMobility(new Date('2022/07/01')),
      '08/2022' : await computeMobility(new Date('2022/08/01')),
      '09/2022' : await computeMobility(new Date('2022/09/01')),
    }
    return month
  }
  computeMobilityOvermonth().then(value => {
    console.log('Nb mobilité', value)
  })
  