export const pad=(n:number)=>String(n).padStart(3,'0')
export const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-')
// Text transcribed from the Instagram posts. c = accent colour taken from each poster.
export const VOLUMES=[
{n:11,edition:'STRANGER THINGS EDITION',line:'THE WORLD IS NOT WHAT IT SEEMS',art:'THE ART OF THE UNKNOWN',c:'#ff4a2b'},
{n:10,edition:'REBELLION EDITION',line:'FIRST RULE OF ***** *****',art:'THE ART OF DESTRUCTION',c:'#a9b4ff'},
{n:9,edition:'COMEDY EDITION',line:'COOL COOL COOL NO DOUBT',art:'THE ART OF HUMOUR',c:'#f4ff00'},
{n:8,edition:'MAGIC EDITION',line:'THE POWER OF KNOWLEDGE',art:'THE ART OF WIT',c:'#ffffff'},
{n:7,edition:'THE NIGHT EDITION',line:'BORN TO BREAK THE RULES',art:'THE ART OF FREEDOM',c:'#2f8bff'},
{n:6,edition:'THEATRE EDITION',line:'CARPE DIEM',art:'THE ART OF DREAMS',c:'#e9e2cf'},
{n:5,edition:'LOVE GONE WRONG EDITION',line:'A STORY 500 DAYS LONG',art:'THE ART OF REALITY',c:'#e6e6e6'},
{n:4,edition:'THE END EDITION',line:'DEATH IN BLACK',art:'THE ART OF HORROR',c:'#d0d0d0'},
{n:3,edition:'THE MENTALIST EDITION',line:'PSYCHOLOGICALLY THRILLING',art:'THE ART OF DECEPTION',c:'#e50914'},
{n:2,edition:'THE FRIENDLY NEIGHBOURHOOD EDITION',line:'EMOTION MAKES A GOOD MOVIE',art:'THE ART OF EMOTION',c:'#1e88ff'},
{n:1,edition:'THE TRICKSTER EDITION',line:'CHAOS IS CREATIVITY',art:'THE ART OF MISCHIEF',c:'#d9b13b'}]
export const ROLES=['Actors','Screenwriter','Cinematographer','Camera Operator','Photographer','Video Editor','Photo Editor','Sound Designer','Sound Recordist','Set Designer','Costume Designer','Makeup Artist']
export const JOIN_ROLES=ROLES // <- edit this list to change the application dropdown
export const GENRES=[['Action','#ff4d1f'],['Adventure','#f5a623'],['Comedy','#f4ff00'],['Romantic','#ff5c8a'],['Drama','#b08968'],['Thriller','#e50914'],['Horror','#9a9a9a'],['Mystery','#7b6cf6'],['Crime','#c9a227'],['Sci-Fi','#1ec8ff'],['Fantasy','#b55df5'],['Documentary','#4caf7a']].map(([name,c])=>({name,c}))
