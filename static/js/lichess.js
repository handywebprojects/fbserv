class Game_{
    constructor(obj, myUsername){

        this.whiteAILevel = obj.players.white.aiLevel
        this.blackAILevel = obj.players.black.aiLevel

        if(!obj.players.white.user) obj.players.white.user = {
            id: "none",
            name: "Stockfish AI level " + this.whiteAILevel
        }

        if(!obj.players.black.user) obj.players.black.user = {
            id: "none",
            name: "Stockfish AI level " + this.blackAILevel
        }

        this.myUsername = myUsername

        this.whiteName = obj.players.white.user.name
        this.blackName = obj.players.black.user.name

        this.meWhite = this.myUsername.toLowerCase() == this.whiteName.toLowerCase()
        this.meBlack = this.myUsername.toLowerCase() == this.blackName.toLowerCase()

        this.myColor = "none"
        if(this.meWhite) this.myColor = "white"
        if(this.meBlack) this.myColor = "black"

        this.opponentName = this.meWhite ? this.blackName : this.whiteName
        
        this.whiteTitle = obj.players.white.user.title || ""
        this.blackTitle = obj.players.black.user.title || ""

        this.whiteBot = this.whiteTitle == "BOT"
        this.blackBot = this.blackTitle == "BOT"

        this.someBot = this.whiteBot || this.blackBot

        this.whiteTitledName = this.whiteTitle == "" ? this.whiteName : this.whiteTitle + " " + this.whiteName
        this.blackTitledName = this.blackTitle == "" ? this.blackName : this.blackTitle + " " + this.blackName

        this.opponentTitledName = this.meWhite ? this.blackTitledName : this.whiteTitledName

        this.whiteRating = obj.players.white.rating || "?"
        this.blackRating = obj.players.black.rating || "?"

        if(obj.clock){
            this.clockInitial = obj.clock.initial
            this.clockIncrement = obj.clock.increment
            this.clockStr = `${this.clockInitial} + ${this.clockIncrement}`
        }else{
            this.clockInitial = "?"
            this.clockIncrement = "?"
            this.clockStr = `?`
        }        

        this.winner = obj.winner

        this.result = 0.5
        this.resultStr = "1/2 - 1/2"        
        this.myResult = 0.5        

        if(this.winner){            
            if(this.winner == "white"){
                this.result = 1
                this.resultStr = "1-0"
                this.myResult = this.myUsername.toLowerCase() == this.whiteName.toLowerCase() ? 1 : 0
            }else{
                this.result = 0
                this.resultStr = "0-1"
                this.myResult = this.myUsername.toLowerCase() == this.blackName.toLowerCase() ? 1 : 0
            }
        }                

        this.perf = obj.perf        
        this.variant = obj.variant || "?"
        
        if(this.perf == "correspondence"){
            this.perf = this.perf + " " + this.variant
            if(obj.daysPerTurn){
                this.clockStr = obj.daysPerTurn + " day(s)"
            }
        }

        this.whiteTitled = ( this.whiteTitle != "" ) && ( !this.whiteBot )
        this.blackTitled = ( this.blackTitle != "" ) && ( !this.blackBot )
        this.someTitled = ( this.whiteTitled || this.blackTitled )
        this.opponentTitle = this.meWhite ? this.blackTitle : this.whiteTitle
        this.opponentTitled = ( ( this.meWhite && this.BlackTitled ) || ( this.meBlack && this.whiteTitled ) )

        this.meWon = ( this.myResult == 1 )
        this.meLost = ( this.myResult == 0 )
        this.draw = ( this.result == 0.5 )

        this.rated = obj.rated        

        this.whiteHuman = (!this.whiteBot) && (!this.whiteAILevel)
        this.blackHuman = (!this.blackBot) && (!this.blackAILevel)        
        this.bothHuman = this.whiteHuman && this.blackHuman

        this.humanRated = this.bothHuman && this.rated

        this.myRating = undefined
        if(this.meWhite) this.myRating = this.whiteRating
        if(this.meBlack) this.myRating = this.blackRating

        this.opponentRating = undefined
        if(this.meWhite) this.opponentRating = this.blackRating
        if(this.meBlack) this.opponentRating = this.whiteRating

        this.ratingDiff = undefined
        if(this.myRating && this.opponentRating) this.ratingDiff = this.myRating - this.opponentRating
    }

    get summary(){
        return `${this.whiteTitledName} ( ${this.whiteRating} ) - ${this.blackTitledName} ( ${this.blackRating} ) [ ${this.perf} ${this.clockStr} ] ${this.resultStr}`
    }
}

function Game(obj, myUsername){return new Game_(obj, myUsername)}

class Tourney_{
    constructor(obj){
        this.id=obj["id"]
        this.perf=obj["perf"]["key"]
        this.perfName=obj["perf"]["name"]
        this.fullName=obj["fullName"]
        this.status=obj["status"]
        this.secondsToStart=obj["secondsToStart"]
        this.minutesToStart=Math.floor(this.secondsToStart/60)
        this.variantKey=obj["variant"]["key"]
        this.variantName=obj["variant"]["name"]
        this.finishesAt=Math.floor(obj["finishesAt"]/1000)
        this.createdBy=obj["createdBy"]
        this.clockLimit=obj["clock"]["limit"]
        this.clockIncrement=obj["clock"]["increment"]
        this.clock=this.clockLimit + " + " + this.clockIncrement
        this.nbPlayers=obj["nbPlayers"]
        this.official=(this.createdBy=="lichess")
    }

    secondsToFinish(){
        return this.finishesAt - Math.floor(new Date().getTime()/1000)
    }

    minutesToFinish(){
        return Math.floor(this.secondsToFinish()/60)
    }

    minutes(){
        if(this.status==10) return this.minutesToStart
        return this.minutesToFinish()
    }

    minutesVerbal(){
        if(this.status==10) return "starts in " + this.minutesToStart + " min(s)"
        if(this.status==20) return "finishes in " + this.minutesToFinish() + " min(s)"
        return "finished " + (-this.minutesToFinish()) + " min(s) ago"
    }
}
function Tourney(obj){return new Tourney_(obj)}

const PERF_TYPES = [
    "ultraBullet",
    "bullet",
    "blitz",
    "rapid",
    "classical",
    "correspondence",
    "chess960",
    "crazyhouse",
    "antichess",
    "atomic",
    "horde",
    "kingOfTheHill",
    "racingKings",
    "threeCheck"
]

const NAMED_PERF_TYPES = [
  [ "ultraBullet", "Ultra Bullet" ],
  [ "bullet", "Bullet" ],
  [ "blitz", "Blitz" ],
  [ "rapid", "Rapid" ],
  [ "classical", "Classical" ],
  [ "correspondence", "Correspondence" ],
  [ "chess960", "Chess960" ],
  [ "crazyhouse", "Crazyhouse" ],
  [ "antichess", "Antichess" ],
  [ "atomic", "Atomic" ],
  [ "horde", "Horde" ],
  [ "kingOfTheHill", "King of the Hill" ],
  [ "racingKings", "Racing Kings" ],
  [ "threeCheck", "Three Check" ]
]

const TOURNEY_TYPES = [
    "created",
    "started",
    "finished"
]

const ECO_CODES = [
    [
      "A00b",
      "Barnes Opening",
      "f3"
    ],
    [
      "A00b",
      "Fried fox",
      "f3 e5 Kf2"
    ],
    [
      "A00c",
      "Kadas Opening",
      "h4"
    ],
    [
      "A00d",
      "Clemenz Opening",
      "h3"
    ],
    [
      "A00e",
      "Ware Opening",
      "a4"
    ],
    [
      "A00f",
      "Anderssen Opening",
      "a3"
    ],
    [
      "A00f",
      "Creepy Crawly Opening (Basman)",
      "a3 e5 h3 d5"
    ],
    [
      "A00g",
      "Amar/Paris Opening",
      "Nh3"
    ],
    [
      "A00g",
      "Amar: Paris Gambit",
      "Nh3 d5 g3 e5 f4"
    ],
    [
      "A00h",
      "Durkin",
      "Na3"
    ],
    [
      "A00i",
      "Saragossa",
      "c3"
    ],
    [
      "A00j",
      "Mieses",
      "d3"
    ],
    [
      "A00j",
      "Mieses: 1...e5",
      "d3 e5"
    ],
    [
      "A00j",
      "Mieses: 1...d5",
      "d3 d5"
    ],
    [
      "A00j",
      "Spike Deferred",
      "d3 g6 g4"
    ],
    [
      "A00k",
      "Van Kruijs",
      "e3"
    ],
    [
      "A00l",
      "Van Geet (Dunst) Opening",
      "Nc3"
    ],
    [
      "A00l",
      "Van Geet: 1...Nf6",
      "Nc3 Nf6"
    ],
    [
      "A00l",
      "Van Geet: 1...Nf6 2.Nf3",
      "Nc3 Nf6 Nf3"
    ],
    [
      "A00l",
      "Van Geet: T\u00fcbingen Gambit",
      "Nc3 Nf6 g4"
    ],
    [
      "A00l",
      "Van Geet: 1...e5",
      "Nc3 e5"
    ],
    [
      "A00l",
      "Van Geet: 1...e5 2.Nf3",
      "Nc3 e5 Nf3"
    ],
    [
      "A00l",
      "Van Geet: Sicilian Variation",
      "Nc3 c5"
    ],
    [
      "A00l",
      "Van Geet: Sicilian Variation, 2.Nf3",
      "Nc3 c5 Nf3"
    ],
    [
      "A00l",
      "Van Geet: Sicilian Variation, 2.Nf3 Nc6",
      "Nc3 c5 Nf3 Nc6"
    ],
    [
      "A00m",
      "Van Geet: 1...d5",
      "Nc3 d5"
    ],
    [
      "A00m",
      "Van Geet: 1...d5 2.Nf3",
      "Nc3 d5 Nf3"
    ],
    [
      "A00m",
      "Van Geet: 1...d5 2.Nf3 Nf6",
      "Nc3 d5 Nf3 Nf6"
    ],
    [
      "A00m",
      "Van Geet: 1...d5 2.e4",
      "Nc3 d5 e4"
    ],
    [
      "A00m",
      "Van Geet: 1...d5 2.e4 d4",
      "Nc3 d5 e4 d4"
    ],
    [
      "A00m",
      "Van Geet: 1...d5 2.e4 dxe4",
      "Nc3 d5 e4 dxe4"
    ],
    [
      "A00m",
      "Van Geet: Hector Gambit",
      "Nc3 d5 e4 dxe4 Bc4"
    ],
    [
      "A00n",
      "Grob",
      "g4"
    ],
    [
      "A00n",
      "Grob: Alessi Gambit",
      "g4 f5"
    ],
    [
      "A00n",
      "Grob: Double Grob",
      "g4 g5"
    ],
    [
      "A00n",
      "Grob: 1...e5",
      "g4 e5"
    ],
    [
      "A00o",
      "Grob: 1...d5",
      "g4 d5"
    ],
    [
      "A00o",
      "Grob Gambit",
      "g4 d5 Bg2"
    ],
    [
      "A00o",
      "Grob Gambit: e5",
      "g4 d5 Bg2 e5"
    ],
    [
      "A00o",
      "Grob Gambit: Hurst Attack",
      "g4 d5 Bg2 e5 c4"
    ],
    [
      "A00o",
      "Grob Gambit: 2...c6",
      "g4 d5 Bg2 c6"
    ],
    [
      "A00o",
      "Grob Gambit: Spike Attack",
      "g4 d5 Bg2 c6 g5"
    ],
    [
      "A00o",
      "Grob Gambit Accepted",
      "g4 d5 Bg2 Bxg4"
    ],
    [
      "A00o",
      "Grob Gambit Accepted: Fritz Gambit",
      "g4 d5 Bg2 Bxg4 c4"
    ],
    [
      "A00p",
      "Polish (Sokolsky; Orang-Utan)",
      "b4"
    ],
    [
      "A00p",
      "Polish: Birmingham Gambit",
      "b4 c5"
    ],
    [
      "A00p",
      "Polish: 1...Nf6",
      "b4 Nf6"
    ],
    [
      "A00p",
      "Polish: 1...Nf6 2.Bb2",
      "b4 Nf6 Bb2"
    ],
    [
      "A00p",
      "Polish: 1...Nf6 2.Bb2 e6",
      "b4 Nf6 Bb2 e6"
    ],
    [
      "A00p",
      "Polish: 1...c6",
      "b4 c6"
    ],
    [
      "A00p",
      "Polish: Sch\u00fchler Gambit",
      "b4 c6 Bb2 a5 b5"
    ],
    [
      "A00q",
      "Polish: 1...d5",
      "b4 d5"
    ],
    [
      "A00q",
      "Polish: 1...d5 2.Bb2",
      "b4 d5 Bb2"
    ],
    [
      "A00q",
      "Polish: 1...d5 2.Bb2 Bf5",
      "b4 d5 Bb2 Bf5"
    ],
    [
      "A00q",
      "Polish: 1...d5 2.Bb2 Nf6",
      "b4 d5 Bb2 Nf6"
    ],
    [
      "A00q",
      "Polish: 1...d5 2.Bb2 Nf6 3.e3",
      "b4 d5 Bb2 Nf6 e3"
    ],
    [
      "A00r",
      "Polish: 1...e5",
      "b4 e5"
    ],
    [
      "A00r",
      "Polish: Bugayev Attack",
      "b4 e5 a3"
    ],
    [
      "A00r",
      "Polish: 1...e5 2.Bb2",
      "b4 e5 Bb2"
    ],
    [
      "A00r",
      "Polish: Wolfertz Gambit",
      "b4 e5 Bb2 c5"
    ],
    [
      "A00r",
      "Polish: 1...e5 2.Bb2 f6",
      "b4 e5 Bb2 f6"
    ],
    [
      "A00r",
      "Polish: Tartakower Gambit",
      "b4 e5 Bb2 f6 e4 Bxb4"
    ],
    [
      "A00r",
      "Polish: 1...e5 2.Bb2 d6",
      "b4 e5 Bb2 d6"
    ],
    [
      "A00s",
      "Polish: 2...Bxb4",
      "b4 e5 Bb2 Bxb4"
    ],
    [
      "A00s",
      "Polish: 2...Bxb4 3.Bxe5",
      "b4 e5 Bb2 Bxb4 Bxe5"
    ],
    [
      "A00s",
      "Polish: 2...Bxb4 3.Bxe5 Nf6",
      "b4 e5 Bb2 Bxb4 Bxe5 Nf6"
    ],
    [
      "A00s",
      "Polish: 2...Bxb4 3.Bxe5 Nf6 4.c4",
      "b4 e5 Bb2 Bxb4 Bxe5 Nf6 c4"
    ],
    [
      "A00s",
      "Polish: 2...Bxb4 3.Bxe5 Nf6 4.Nf3",
      "b4 e5 Bb2 Bxb4 Bxe5 Nf6 Nf3"
    ],
    [
      "A00t",
      "Benko Opening",
      "g3"
    ],
    [
      "A00t",
      "Benko Opening",
      "g3 Nf6"
    ],
    [
      "A00t",
      "Benko Opening: Symmetrical",
      "g3 g6"
    ],
    [
      "A00u",
      "Benko Opening",
      "g3 e5"
    ],
    [
      "A00v",
      "Benko Opening",
      "g3 d5"
    ],
    [
      "A00v",
      "Benko Opening",
      "g3 d5 Bg2"
    ],
    [
      "A00v",
      "Benko Opening",
      "g3 d5 Bg2 c6"
    ],
    [
      "A00v",
      "Benko Opening",
      "g3 d5 Bg2 e5"
    ],
    [
      "A00v",
      "Benko Opening",
      "g3 d5 Bg2 Nf6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen Attack",
      "b3"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Polish Variation",
      "b3 b5"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Symmetrical",
      "b3 b6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Dutch Variation",
      "b3 f5"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Ringelbach Gambit",
      "b3 f5 Bb2 e6 e4"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: English Variation",
      "b3 c5"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Indian Variation",
      "b3 Nf6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Indian Variation",
      "b3 Nf6 Bb2 g6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Spike Variation",
      "b3 Nf6 Bb2 g6 g4"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...d5",
      "b3 d5"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...d5 2.Bb2",
      "b3 d5 Bb2"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...e5",
      "b3 e5"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...e5 2.Bb2",
      "b3 e5 Bb2"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...e5 2.Bb2 d6",
      "b3 e5 Bb2 d6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...e5 2.Bb2 Nc6",
      "b3 e5 Bb2 Nc6"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: Paschmann Gambit",
      "b3 e5 Bb2 Nc6 f4"
    ],
    [
      "A01",
      "Nimzowitsch-Larsen: 1...e5 2.Bb2 Nc6 3.e3",
      "b3 e5 Bb2 Nc6 e3"
    ],
    [
      "A02",
      "Bird",
      "f4"
    ],
    [
      "A02",
      "Bird: Hobbs Gambit",
      "f4 g5"
    ],
    [
      "A02",
      "Bird: Symmetrical",
      "f4 f5"
    ],
    [
      "A02",
      "Bird: Swiss Gambit",
      "f4 f5 e4"
    ],
    [
      "A02",
      "Bird: Swiss Gambit",
      "f4 f5 e4 fxe4 Nc3 Nf6 g4"
    ],
    [
      "A02",
      "Bird: 1..d6",
      "f4 d6"
    ],
    [
      "A02",
      "Bird: 1..g6",
      "f4 g6"
    ],
    [
      "A02",
      "Bird: 1..g6",
      "f4 g6 Nf3 Bg7 e3"
    ],
    [
      "A02",
      "Bird: 1..g6",
      "f4 g6 Nf3 Bg7 g3"
    ],
    [
      "A02",
      "Bird: 1..c5",
      "f4 c5"
    ],
    [
      "A02",
      "Bird: 1..c5 2.Nf3 Nc6",
      "f4 c5 Nf3 Nc6"
    ],
    [
      "A02",
      "Bird: From Gambit",
      "f4 e5"
    ],
    [
      "A02",
      "Bird: From Gambit Accepted",
      "f4 e5 fxe5"
    ],
    [
      "A02",
      "Bird: From Gambit, Schlecter",
      "f4 e5 fxe5 Nc6"
    ],
    [
      "A02",
      "Bird: From Gambit, 2...d6",
      "f4 e5 fxe5 d6"
    ],
    [
      "A02",
      "Bird: From Gambit, 3.exd6",
      "f4 e5 fxe5 d6 exd6"
    ],
    [
      "A02",
      "Bird: From Gambit, Langheld Gambit",
      "f4 e5 fxe5 d6 exd6 Nf6"
    ],
    [
      "A02",
      "Bird: From Gambit, 3...Bxd6",
      "f4 e5 fxe5 d6 exd6 Bxd6"
    ],
    [
      "A02",
      "Bird: From Gambit, Lipke",
      "f4 e5 fxe5 d6 exd6 Bxd6 Nf3 Nh6 d4"
    ],
    [
      "A02",
      "Bird: 1..Nf6",
      "f4 Nf6"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.g3",
      "f4 Nf6 g3"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.e3",
      "f4 Nf6 e3"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.b3",
      "f4 Nf6 b3"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3",
      "f4 Nf6 Nf3"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 d6",
      "f4 Nf6 Nf3 d6"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 c5",
      "f4 Nf6 Nf3 c5"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 g6",
      "f4 Nf6 Nf3 g6"
    ],
    [
      "A02",
      "Bird: Batavo Polish Attack",
      "f4 Nf6 Nf3 g6 b4"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 g6 3.g3",
      "f4 Nf6 Nf3 g6 g3"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 g6 3.g3",
      "f4 Nf6 Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A02",
      "Bird: 1..Nf6 2.Nf3 g6 3.g3",
      "f4 Nf6 Nf3 g6 g3 Bg7 Bg2 d6"
    ],
    [
      "A03",
      "Bird: 1...d5",
      "f4 d5"
    ],
    [
      "A03",
      "Bird: Dudweiler Gambit",
      "f4 d5 g4"
    ],
    [
      "A03",
      "Bird: Sturm Gambit",
      "f4 d5 c4"
    ],
    [
      "A03",
      "Bird: Williams Gambit",
      "f4 d5 e4"
    ],
    [
      "A03",
      "Bird: 1...d5 2.b3",
      "f4 d5 b3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.b3",
      "f4 d5 b3 Nf6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.b3",
      "f4 d5 b3 Nf6 Bb2"
    ],
    [
      "A03",
      "Bird: 1...d5 2.g3",
      "f4 d5 g3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.g3",
      "f4 d5 g3 Nf6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.g3",
      "f4 d5 g3 Nf6 Bg2"
    ],
    [
      "A03",
      "Bird: Lasker Variation",
      "f4 d5 e3"
    ],
    [
      "A03",
      "Bird: Lasker Variation",
      "f4 d5 e3 Nf6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3",
      "f4 d5 Nf3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 c5",
      "f4 d5 Nf3 c5"
    ],
    [
      "A03",
      "Bird: Batavo Gambit",
      "f4 d5 Nf3 c5 e4"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 c5 3.e3",
      "f4 d5 Nf3 c5 e3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 g6",
      "f4 d5 Nf3 g6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 g6 3.e3",
      "f4 d5 Nf3 g6 e3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 g6 3.g3",
      "f4 d5 Nf3 g6 g3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 g6 3.g3",
      "f4 d5 Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 Nf6",
      "f4 d5 Nf3 Nf6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 Nf6 3.b3",
      "f4 d5 Nf3 Nf6 b3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 Nf6 3.g3",
      "f4 d5 Nf3 Nf6 g3"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 Nf6 3.g3 g6",
      "f4 d5 Nf3 Nf6 g3 g6"
    ],
    [
      "A03",
      "Bird: 1...d5 2.Nf3 Nf6 3.g3 g6",
      "f4 d5 Nf3 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "A03",
      "Bird: Lasker Variation",
      "f4 d5 Nf3 Nf6 e3"
    ],
    [
      "A03",
      "Bird: Lasker, 3...Bg4",
      "f4 d5 Nf3 Nf6 e3 Bg4"
    ],
    [
      "A03",
      "Bird: Lasker, 3...e6",
      "f4 d5 Nf3 Nf6 e3 e6"
    ],
    [
      "A03",
      "Bird: Lasker, 3...c5",
      "f4 d5 Nf3 Nf6 e3 c5"
    ],
    [
      "A03",
      "Bird: Lasker, 3...c5 4.b3",
      "f4 d5 Nf3 Nf6 e3 c5 b3"
    ],
    [
      "A03",
      "Bird: Lasker, 3...g6",
      "f4 d5 Nf3 Nf6 e3 g6"
    ],
    [
      "A04",
      "Reti",
      "Nf3"
    ],
    [
      "A04",
      "Reti: Herrstr\u00f6m Gambit",
      "Nf3 g5"
    ],
    [
      "A04",
      "Reti: 1...b6",
      "Nf3 b6"
    ],
    [
      "A04",
      "Reti: 1...b5",
      "Nf3 b5"
    ],
    [
      "A04",
      "Reti: 1...Nc6",
      "Nf3 Nc6"
    ],
    [
      "A04",
      "Reti: 1...e6",
      "Nf3 e6"
    ],
    [
      "A04",
      "Reti: 1...e6",
      "Nf3 e6 g3"
    ],
    [
      "A04",
      "Reti: 1...g6",
      "Nf3 g6"
    ],
    [
      "A04",
      "Reti: 1...g6",
      "Nf3 g6 g3"
    ],
    [
      "A04",
      "Reti: 1...g6",
      "Nf3 g6 g3 Bg7"
    ],
    [
      "A04",
      "Reti: 1...g6",
      "Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A04",
      "Reti: 1...f5",
      "Nf3 f5"
    ],
    [
      "A04",
      "Reti: 1...f5 2.d3",
      "Nf3 f5 d3"
    ],
    [
      "A04",
      "Reti: 1...f5 2.d3 Nf6",
      "Nf3 f5 d3 Nf6"
    ],
    [
      "A04",
      "Reti: Lisitsin Deferred",
      "Nf3 f5 d3 Nf6 e4"
    ],
    [
      "A04",
      "Reti: 1...f5 2.g3",
      "Nf3 f5 g3"
    ],
    [
      "A04",
      "Reti: Lisitsin",
      "Nf3 f5 e4"
    ],
    [
      "A04",
      "Reti: Lisitsin: 3.Ng5 Nf6",
      "Nf3 f5 e4 fxe4 Ng5 Nf6"
    ],
    [
      "A04",
      "Reti: Lisitsin: 3.Ng5 Nf6",
      "Nf3 f5 e4 fxe4 Ng5 Nf6 d3 e5"
    ],
    [
      "A04",
      "Reti: Lisitsin: 3.Ng5 Nf6",
      "Nf3 f5 e4 fxe4 Ng5 Nf6 d3 e3"
    ],
    [
      "A04",
      "Reti: Lisitsin: 3.Ng5 e5",
      "Nf3 f5 e4 fxe4 Ng5 e5"
    ],
    [
      "A04",
      "Reti: Lisitsin: 3.Ng5 d5",
      "Nf3 f5 e4 fxe4 Ng5 d5"
    ],
    [
      "A04",
      "Reti: 1...d6",
      "Nf3 d6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5"
    ],
    [
      "A04",
      "Reti: 1...c5, Nimzowitsch-Larsen",
      "Nf3 c5 b3"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 b6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 b6 Bg2 Bb7"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6 d3"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6 d3 Nf6 e4"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6 d3 Nf6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6 d3 d6 e4"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 g6 Bg2 Bg7 O-O Nc6 d3 e6 e4"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 Nc6"
    ],
    [
      "A04",
      "Reti: 1...c5",
      "Nf3 c5 g3 Nc6 Bg2"
    ],
    [
      "A05",
      "Reti: 1...Nf6",
      "Nf3 Nf6"
    ],
    [
      "A05",
      "Reti: 1...Nf6 2.b3",
      "Nf3 Nf6 b3"
    ],
    [
      "A05",
      "Reti: Santasiere's folly",
      "Nf3 Nf6 b4"
    ],
    [
      "A05",
      "Reti: 1...Nf6 2.e3",
      "Nf3 Nf6 e3"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 c5"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 c5 Bg2"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 c5 Bg2 Nc6"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 b6"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 b6 Bg2"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 b6 Bg2 Bb7"
    ],
    [
      "A05",
      "Reti: KIA, Spassky",
      "Nf3 Nf6 g3 b5"
    ],
    [
      "A05",
      "Reti: KIA, Spassky",
      "Nf3 Nf6 g3 b5 Bg2"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6"
    ],
    [
      "A05",
      "Reti: KIA, Reti-Smyslov Variation",
      "Nf3 Nf6 g3 g6 b4"
    ],
    [
      "A05",
      "Reti: KIA, Reti-Smyslov Variation",
      "Nf3 Nf6 g3 g6 b4 Bg7 Bb2"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7 O-O"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O d3"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O d3 c5"
    ],
    [
      "A05",
      "Reti: KIA",
      "Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O d3 d6"
    ],
    [
      "A06",
      "Reti: 1...d5",
      "Nf3 d5"
    ],
    [
      "A06",
      "Reti: Ampel Variation",
      "Nf3 d5 Rg1"
    ],
    [
      "A06",
      "Reti: Old Indian Attack",
      "Nf3 d5 d3"
    ],
    [
      "A06",
      "Reti: Old Indian Attack",
      "Nf3 d5 d3 Nf6"
    ],
    [
      "A06",
      "Reti: 1...d5 2.e3",
      "Nf3 d5 e3"
    ],
    [
      "A06",
      "Reti: Santasiere's folly",
      "Nf3 d5 b4"
    ],
    [
      "A06",
      "Reti: Santasiere's folly",
      "Nf3 d5 b4 Nf6"
    ],
    [
      "A06",
      "Reti: Tennison/Zukertort Gambit",
      "Nf3 d5 e4"
    ],
    [
      "A06",
      "Reti: Tennison Gambit Accepted",
      "Nf3 d5 e4 dxe4"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen",
      "Nf3 d5 b3"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...c5",
      "Nf3 d5 b3 c5"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Bg4",
      "Nf3 d5 b3 Bg4"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Bg4",
      "Nf3 d5 b3 Bg4 Bb2"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Bg4",
      "Nf3 d5 b3 Bg4 Bb2 Nd7 e3"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Nf6",
      "Nf3 d5 b3 Nf6"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Nf6",
      "Nf3 d5 b3 Nf6 Bb2"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Nf6",
      "Nf3 d5 b3 Nf6 Bb2 e6"
    ],
    [
      "A06",
      "Reti: Nimzowitsch-Larsen, 2...Nf6",
      "Nf3 d5 b3 Nf6 Bb2 e6 e3"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nc6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nc6 Bg2 e5"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nc6 Bg2 e5 d3 Nf6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nc6 Bg2 e5 d3 Nf6 O-O"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nc6 Bg2 e5 d3 Nf6 O-O Be7"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 c6"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 c6 Bg2 Bg4"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 c6 Bg2 Bg4 O-O"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 c6 Bg2 Bg4 O-O Nd7"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 c6 Bg2 Bg4 O-O Nd7 d3"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 Nf6 Bg2 c6 O-O Bg4"
    ],
    [
      "A07",
      "Reti: KIA, Yugoslav",
      "Nf3 d5 g3 Nf6 Bg2 c6 O-O Bg4 d3"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Bg4"
    ],
    [
      "A07",
      "Reti: KIA, Keres Variation",
      "Nf3 d5 g3 Bg4 Bg2 Nd7"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nf6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nf6 Bg2"
    ],
    [
      "A07",
      "Reti: KIA, Neo-Gr\u00fcnfeld",
      "Nf3 d5 g3 Nf6 Bg2 g6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nf6 Bg2 Bf5"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nf6 Bg2 e6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 Nf6 Bg2 c6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 g6"
    ],
    [
      "A07",
      "Reti: KIA",
      "Nf3 d5 g3 g6 Bg2"
    ],
    [
      "A07",
      "Reti: KIA, Pachman",
      "Nf3 d5 g3 g6 Bg2 Bg7 O-O e5 d3 Ne7"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5",
      "Nf3 d5 g3 c5"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5",
      "Nf3 d5 g3 c5 Bg2"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5 + 3...g6",
      "Nf3 d5 g3 c5 Bg2 g6 O-O Bg7"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5 + 3...g6",
      "Nf3 d5 g3 c5 Bg2 g6 O-O Bg7 d3"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5  3.Bg2 Nc6",
      "Nf3 d5 g3 c5 Bg2 Nc6"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5, 3.Bg2 Nc6 4.O-O",
      "Nf3 d5 g3 c5 Bg2 Nc6 O-O"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5, 3.Bg2 Nc6 4.d4",
      "Nf3 d5 g3 c5 Bg2 Nc6 d4"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5 3.Bg2 Nf6",
      "Nf3 d5 g3 c5 Bg2 Nf6"
    ],
    [
      "A08",
      "Reti: KIA, 2...c5 3.Bg2 Nf6 4.O-O",
      "Nf3 d5 g3 c5 Bg2 Nf6 O-O"
    ],
    [
      "A09a",
      "Reti: 2.c4",
      "Nf3 d5 c4"
    ],
    [
      "A09b",
      "Reti: Advance Variation",
      "Nf3 d5 c4 d4"
    ],
    [
      "A09c",
      "Reti: Advance, Anglo-Polish Attack",
      "Nf3 d5 c4 d4 b4"
    ],
    [
      "A09c",
      "Reti: Advance, Anglo-Polish, 3...g6",
      "Nf3 d5 c4 d4 b4 g6"
    ],
    [
      "A09d",
      "Reti: Advance, 3.e3",
      "Nf3 d5 c4 d4 e3"
    ],
    [
      "A09e",
      "Reti: Advance, 3.e3 c5",
      "Nf3 d5 c4 d4 e3 c5"
    ],
    [
      "A09f",
      "Reti: Advance, 3.e3 Nc6",
      "Nf3 d5 c4 d4 e3 Nc6"
    ],
    [
      "A09g",
      "Reti: Advance, 3.g3",
      "Nf3 d5 c4 d4 g3"
    ],
    [
      "A09h",
      "Reti: Advance, 3.g3 Nc6",
      "Nf3 d5 c4 d4 g3 Nc6"
    ],
    [
      "A09h",
      "Reti: Advance, 3.g3 Nc6 4.Bg2 e5",
      "Nf3 d5 c4 d4 g3 Nc6 Bg2 e5"
    ],
    [
      "A09i",
      "Reti: Advance, 3.g3 g6",
      "Nf3 d5 c4 d4 g3 g6"
    ],
    [
      "A09i",
      "Reti: Advance, 3.g3 g6 4.Bg2 Bg7",
      "Nf3 d5 c4 d4 g3 g6 Bg2 Bg7"
    ],
    [
      "A09j",
      "Reti: Advance, 3.g3 c5",
      "Nf3 d5 c4 d4 g3 c5"
    ],
    [
      "A09j",
      "Reti: Advance, 3.g3 c5 4.Bg2 Nc6",
      "Nf3 d5 c4 d4 g3 c5 Bg2 Nc6"
    ],
    [
      "A09k",
      "Reti: Accepted",
      "Nf3 d5 c4 dxc4"
    ],
    [
      "A09l",
      "Reti: Accepted, 3.g3",
      "Nf3 d5 c4 dxc4 g3"
    ],
    [
      "A09m",
      "Reti: Accepted, 3.g3 e6",
      "Nf3 d5 c4 dxc4 g3 e6"
    ],
    [
      "A09n",
      "Reti: Accepted, 3.Qa4+",
      "Nf3 d5 c4 dxc4 Qa4+"
    ],
    [
      "A09o",
      "Reti: Accepted, 3.Na3",
      "Nf3 d5 c4 dxc4 Na3"
    ],
    [
      "A09p",
      "Reti: Accepted, 3.Na3 a6",
      "Nf3 d5 c4 dxc4 Na3 a6"
    ],
    [
      "A09q",
      "Reti: Accepted, 3.Na3 c5",
      "Nf3 d5 c4 dxc4 Na3 c5"
    ],
    [
      "A09r",
      "Reti: Accepted, 3.e3",
      "Nf3 d5 c4 dxc4 e3"
    ],
    [
      "A09s",
      "Reti: Accepted, Keres Variation",
      "Nf3 d5 c4 dxc4 e3 Be6"
    ],
    [
      "A09t",
      "Reti: Accepted, 3.e3 Nf6",
      "Nf3 d5 c4 dxc4 e3 Nf6"
    ],
    [
      "A10",
      "English",
      "c4"
    ],
    [
      "A10",
      "English: 1...g5",
      "c4 g5"
    ],
    [
      "A10",
      "English: 1...g5 2.d4",
      "c4 g5 d4"
    ],
    [
      "A10",
      "English: Myers Gambit",
      "c4 g5 d4 Bg7"
    ],
    [
      "A10",
      "English: 1...Nc6",
      "c4 Nc6"
    ],
    [
      "A10",
      "English: 1...Nc6 2.Nc3",
      "c4 Nc6 Nc3"
    ],
    [
      "A10",
      "English: J\u00e4nisch Gambit",
      "c4 b5"
    ],
    [
      "A10",
      "English: Vector",
      "c4 d5"
    ],
    [
      "A10",
      "English: 1...b6",
      "c4 b6"
    ],
    [
      "A10",
      "English: 1...b6 2.Nf3",
      "c4 b6 Nf3"
    ],
    [
      "A10",
      "English: 1...b6 2.Nf3 Bb7",
      "c4 b6 Nf3 Bb7"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3",
      "c4 b6 Nc3"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3 e6",
      "c4 b6 Nc3 e6"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3 e6 3.e4",
      "c4 b6 Nc3 e6 e4"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3 Bb7",
      "c4 b6 Nc3 Bb7"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3 Bb7 3.e4",
      "c4 b6 Nc3 Bb7 e4"
    ],
    [
      "A10",
      "English: 1...b6 2.Nc3 Bb7 3.e4 e6",
      "c4 b6 Nc3 Bb7 e4 e6"
    ],
    [
      "A10",
      "English: 1...d6",
      "c4 d6"
    ],
    [
      "A10",
      "English: 1...d6",
      "c4 d6 Nc3"
    ],
    [
      "A10",
      "English: 1...d6",
      "c4 d6 Nf3"
    ],
    [
      "A10",
      "English: 1...g6",
      "c4 g6"
    ],
    [
      "A10",
      "English: 1...g6 2.g3",
      "c4 g6 g3"
    ],
    [
      "A10",
      "English: 1...g6 2.Nc3",
      "c4 g6 Nc3"
    ],
    [
      "A10",
      "English: 1...g6 2.Nc3 Bg7",
      "c4 g6 Nc3 Bg7"
    ],
    [
      "A10",
      "English: 1...g6 2.Nc3 Bg7 3.g3",
      "c4 g6 Nc3 Bg7 g3"
    ],
    [
      "A10",
      "English: 1...g6",
      "c4 g6 Nf3"
    ],
    [
      "A10",
      "English: 1...g6",
      "c4 g6 Nf3 Bg7"
    ],
    [
      "A10",
      "English: 1...g6 2.e4",
      "c4 g6 e4"
    ],
    [
      "A10",
      "English: Adorjan Defence",
      "c4 g6 e4 e5"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5"
    ],
    [
      "A10",
      "English: Wade Gambit",
      "c4 f5 g4"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 g3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 g3 Nf6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 g3 Nf6 Bg2"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nc3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nc3 Nf6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nc3 Nf6 g3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nc3 Nf6 g3 g6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 e6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 Nc3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6 Bg2"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6 Bg2 c6 O-O d5"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6 Bg2 Be7"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6 Bg2 Be7 O-O"
    ],
    [
      "A10",
      "English: Anglo-Dutch",
      "c4 f5 Nf3 Nf6 g3 e6 Bg2 Be7 O-O O-O"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5 Nf3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5 Nf3 Bf5"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5 Nf3 Bf5 O-O"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5 Nf3 Bg4"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 g3 Nf6 Bg2 d5 Nf3 Bg4 O-O"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 Nc3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 Nc3 d5"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 Nf3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 Nf3 Nf6"
    ],
    [
      "A11",
      "English: Caro-Kann Defence",
      "c4 c6 Nf3 d5"
    ],
    [
      "A11",
      "English: Caro-Kann Defence, 3.g3",
      "c4 c6 Nf3 d5 g3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence, 3.g3 Bg4",
      "c4 c6 Nf3 d5 g3 Bg4"
    ],
    [
      "A11",
      "English: Caro-Kann Defence, 3.g3 Bg4",
      "c4 c6 Nf3 d5 g3 Bg4 Bg2"
    ],
    [
      "A11",
      "English: Caro-Kann Defence, 3.e3",
      "c4 c6 Nf3 d5 e3"
    ],
    [
      "A11",
      "English: Caro-Kann Defence, 3.e3 Nf6",
      "c4 c6 Nf3 d5 e3 Nf6"
    ],
    [
      "A12",
      "English: Caro-Kann Defence, 3.b3",
      "c4 c6 Nf3 d5 b3"
    ],
    [
      "A12",
      "English: Torre Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bg4"
    ],
    [
      "A12",
      "English: Torre Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bg4 Bg2"
    ],
    [
      "A12",
      "English: Torre Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bg4 Bg2 e6"
    ],
    [
      "A12",
      "English: London Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bf5"
    ],
    [
      "A12",
      "English: London Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bf5 Bg2"
    ],
    [
      "A12",
      "English: London Defence",
      "c4 c6 Nf3 d5 b3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "A12",
      "English: Caro-Kann Defence, 3.b3",
      "c4 c6 Nf3 d5 b3 Nf6 Bb2"
    ],
    [
      "A12",
      "English: Bled Variation",
      "c4 c6 Nf3 d5 b3 Nf6 Bb2 g6"
    ],
    [
      "A12",
      "English: Bled Variation",
      "c4 c6 Nf3 d5 b3 Nf6 Bb2 g6 e3 Bg7"
    ],
    [
      "A12",
      "English: New York/London Defence",
      "c4 c6 Nf3 d5 b3 Nf6 Bb2 Bf5"
    ],
    [
      "A12",
      "English: Capablanca",
      "c4 c6 Nf3 d5 b3 Nf6 Bb2 Bg4"
    ],
    [
      "A12",
      "English: Bogoljubow Variation",
      "c4 c6 Nf3 d5 b3 Bg4"
    ],
    [
      "A13a",
      "English: 1...e6",
      "c4 e6"
    ],
    [
      "A13b",
      "English: 1...e6 2.g3",
      "c4 e6 g3"
    ],
    [
      "A13c",
      "English: 1...e6 2.g3 d5",
      "c4 e6 g3 d5"
    ],
    [
      "A13d",
      "English: 1...e6 2.g3 d5",
      "c4 e6 g3 d5 Bg2"
    ],
    [
      "A13e",
      "English: 1...e6 2.Nc3",
      "c4 e6 Nc3"
    ],
    [
      "A13f",
      "English: 1...e6 2.Nc3 Bb4",
      "c4 e6 Nc3 Bb4"
    ],
    [
      "A13g",
      "English: 1...e6 2.Nc3 d5",
      "c4 e6 Nc3 d5"
    ],
    [
      "A13h",
      "English: 1...e6 2.Nf3",
      "c4 e6 Nf3"
    ],
    [
      "A13i",
      "English: 1...e6 2.Nf3 Nf6",
      "c4 e6 Nf3 Nf6"
    ],
    [
      "A13j",
      "English: 1...e6 2.Nf3 Nf6 3.g3",
      "c4 e6 Nf3 Nf6 g3"
    ],
    [
      "A13k",
      "English: Romanishin Gambit",
      "c4 e6 Nf3 Nf6 g3 a6 Bg2 b5"
    ],
    [
      "A13l",
      "English: 1...e6 2.Nf3 d5",
      "c4 e6 Nf3 d5"
    ],
    [
      "A13m",
      "English: Agincourt Variation",
      "c4 e6 Nf3 d5 b3"
    ],
    [
      "A13n",
      "English: Wimpey System",
      "c4 e6 Nf3 d5 b3 Nf6 Bb2 c5 e3"
    ],
    [
      "A13n",
      "English: Wimpey System",
      "c4 e6 Nf3 d5 b3 Nf6 Bb2 c5 e3 Nc6"
    ],
    [
      "A13o",
      "English: Agincourt Variation",
      "c4 e6 Nf3 d5 g3"
    ],
    [
      "A13p",
      "English: Kurajica Defence",
      "c4 e6 Nf3 d5 g3 c6"
    ],
    [
      "A13q",
      "English: Kurajica Defence",
      "c4 e6 Nf3 d5 g3 c6 Qc2"
    ],
    [
      "A13r",
      "English: Neo-Catalan",
      "c4 e6 Nf3 d5 g3 Nf6"
    ],
    [
      "A13s",
      "English: Neo-Catalan",
      "c4 e6 Nf3 d5 g3 Nf6 Bg2"
    ],
    [
      "A13s",
      "English: Neo-Catalan, 4...c6",
      "c4 e6 Nf3 d5 g3 Nf6 Bg2 c6"
    ],
    [
      "A13t",
      "English: Neo-Catalan, 4...c5",
      "c4 e6 Nf3 d5 g3 Nf6 Bg2 c5"
    ],
    [
      "A13u",
      "English: Neo-Catalan Accepted",
      "c4 e6 Nf3 d5 g3 Nf6 Bg2 dxc4"
    ],
    [
      "A14",
      "English: Neo-Catalan Declined",
      "c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7"
    ],
    [
      "A15",
      "English: Anglo-Indian",
      "c4 Nf6"
    ],
    [
      "A15",
      "English: Anglo-Indian, Polish",
      "c4 Nf6 b4"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.g3",
      "c4 Nf6 g3"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.g3 e6",
      "c4 Nf6 g3 e6"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.g3 e6",
      "c4 Nf6 g3 e6 Bg2"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.g3 g6",
      "c4 Nf6 g3 g6"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.g3 g6",
      "c4 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.Nf3",
      "c4 Nf6 Nf3"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.Nf3 g6",
      "c4 Nf6 Nf3 g6"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.Nf3 g6",
      "c4 Nf6 Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A15",
      "English: Anglo-Indian, 2.Nf3 g6",
      "c4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3",
      "c4 Nf6 Nc3"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 Nc6",
      "c4 Nf6 Nc3 Nc6"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 c6",
      "c4 Nf6 Nc3 c6"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 c6 3.e4",
      "c4 Nf6 Nc3 c6 e4"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 c6 3.e4 d5",
      "c4 Nf6 Nc3 c6 e4 d5"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 c6 3.e4 e5",
      "c4 Nf6 Nc3 c6 e4 e5"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 d6",
      "c4 Nf6 Nc3 d6"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 g6",
      "c4 Nf6 Nc3 g6"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 g6 3.e4",
      "c4 Nf6 Nc3 g6 e4"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 g6 3.g3",
      "c4 Nf6 Nc3 g6 g3"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 g6 3.g3",
      "c4 Nf6 Nc3 g6 g3 Bg7"
    ],
    [
      "A16",
      "English: Anglo-Indian, 2.Nc3 g6 3.g3",
      "c4 Nf6 Nc3 g6 g3 Bg7 Bg2"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld",
      "c4 Nf6 Nc3 d5"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld",
      "c4 Nf6 Nc3 d5 Nf3"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld",
      "c4 Nf6 Nc3 d5 Nf3 g6"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld",
      "c4 Nf6 Nc3 d5 Nf3 g6 Qa4+"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld",
      "c4 Nf6 Nc3 d5 Nf3 g6 g3"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld, 3.cxd5",
      "c4 Nf6 Nc3 d5 cxd5"
    ],
    [
      "A16",
      "English: Anglo-Gr\u00fcnfeld, 4.Nf3",
      "c4 Nf6 Nc3 d5 cxd5 Nxd5 Nf3"
    ],
    [
      "A17",
      "English: Anglo-Indian, 2.Nc3 e6",
      "c4 Nf6 Nc3 e6"
    ],
    [
      "A17",
      "English: Anglo-Indian, 2.Nc3 e6 3.g3",
      "c4 Nf6 Nc3 e6 g3"
    ],
    [
      "A17",
      "English: Anglo-Indian, 2.Nc3 e6 3.Nf3",
      "c4 Nf6 Nc3 e6 Nf3"
    ],
    [
      "A17",
      "English: Anglo-Indian, 2.Nc3 e6 3.Nf3 d5",
      "c4 Nf6 Nc3 e6 Nf3 d5"
    ],
    [
      "A17",
      "English: Anglo-Queen's Indian",
      "c4 Nf6 Nc3 e6 Nf3 b6"
    ],
    [
      "A17",
      "English: Nimzo-English",
      "c4 Nf6 Nc3 e6 Nf3 Bb4"
    ],
    [
      "A17",
      "English: Nimzo-English, 4.g3",
      "c4 Nf6 Nc3 e6 Nf3 Bb4 g3"
    ],
    [
      "A17",
      "English: Nimzo-English, 4.Qc2",
      "c4 Nf6 Nc3 e6 Nf3 Bb4 Qc2"
    ],
    [
      "A18",
      "English: Mikenas",
      "c4 Nf6 Nc3 e6 e4"
    ],
    [
      "A18",
      "English: Mikenas, Kevitz Defence",
      "c4 Nf6 Nc3 e6 e4 Nc6"
    ],
    [
      "A18",
      "English: Mikenas, 3...d6",
      "c4 Nf6 Nc3 e6 e4 d6"
    ],
    [
      "A18",
      "English: Mikenas, 3...d6 4.d4 Be7",
      "c4 Nf6 Nc3 e6 e4 d6 d4 Be7"
    ],
    [
      "A18",
      "English: Mikenas, French Variation",
      "c4 Nf6 Nc3 e6 e4 d5"
    ],
    [
      "A18",
      "English: Mikenas, French, 4.cxd5",
      "c4 Nf6 Nc3 e6 e4 d5 cxd5"
    ],
    [
      "A18",
      "English: Mikenas, Flohr Variation",
      "c4 Nf6 Nc3 e6 e4 d5 e5"
    ],
    [
      "A18",
      "English: Mikenas, Flohr, 4...Ne4",
      "c4 Nf6 Nc3 e6 e4 d5 e5 Ne4"
    ],
    [
      "A18",
      "English: Mikenas, Flohr, 4...d4",
      "c4 Nf6 Nc3 e6 e4 d5 e5 d4"
    ],
    [
      "A19",
      "English: Mikenas, Sicilian Variation",
      "c4 Nf6 Nc3 e6 e4 c5"
    ],
    [
      "A19",
      "English: Mikenas, Sicilian, 4.e5",
      "c4 Nf6 Nc3 e6 e4 c5 e5"
    ],
    [
      "A19",
      "English: Mikenas, 5.Nf3",
      "c4 Nf6 Nc3 e6 e4 c5 e5 Ng8 Nf3"
    ],
    [
      "A20",
      "English: King's (1...e5)",
      "c4 e5"
    ],
    [
      "A20",
      "English: King's, 2.d3",
      "c4 e5 d3"
    ],
    [
      "A20",
      "English: King's, 2.e3",
      "c4 e5 e3"
    ],
    [
      "A20",
      "English: King's, 2.g3",
      "c4 e5 g3"
    ],
    [
      "A20",
      "English: King's, 2.g3 f5",
      "c4 e5 g3 f5"
    ],
    [
      "A20",
      "English: King's, 2.g3 g6",
      "c4 e5 g3 g6"
    ],
    [
      "A20",
      "English: King's, 2.g3 g6",
      "c4 e5 g3 g6 Bg2"
    ],
    [
      "A20",
      "English: King's, 2.g3 g6",
      "c4 e5 g3 g6 Bg2 Bg7"
    ],
    [
      "A20",
      "English: King's, 2.g3 c6",
      "c4 e5 g3 c6"
    ],
    [
      "A20",
      "English: King's, 2.g3 c6 3.d4",
      "c4 e5 g3 c6 d4"
    ],
    [
      "A20",
      "English: King's, 2.g3 d6",
      "c4 e5 g3 d6"
    ],
    [
      "A20",
      "English: King's, 2.g3 d6",
      "c4 e5 g3 d6 Bg2"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nc6",
      "c4 e5 g3 Nc6"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nc6 3.Bg2",
      "c4 e5 g3 Nc6 Bg2"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6",
      "c4 e5 g3 Nf6"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6 3.Bg2",
      "c4 e5 g3 Nf6 Bg2"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6 3.Bg2 Bc5",
      "c4 e5 g3 Nf6 Bg2 Bc5"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6 3.Bg2 Nc6",
      "c4 e5 g3 Nf6 Bg2 Nc6"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6 3.Bg2 c6",
      "c4 e5 g3 Nf6 Bg2 c6"
    ],
    [
      "A20",
      "English: King's, 2.g3 Nf6 3.Bg2 d5",
      "c4 e5 g3 Nf6 Bg2 d5"
    ],
    [
      "A20",
      "English: King's, Nimzowitsch",
      "c4 e5 Nf3"
    ],
    [
      "A20",
      "English: King's, Nimzowitsch, 2...Nc6",
      "c4 e5 Nf3 Nc6"
    ],
    [
      "A20",
      "English: King's, Nimzowitsch, Flohr Variation",
      "c4 e5 Nf3 e4"
    ],
    [
      "A21",
      "English: King's, 2.Nc3",
      "c4 e5 Nc3"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 f5",
      "c4 e5 Nc3 f5"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 f5",
      "c4 e5 Nc3 f5 g3 Nf6"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 f5",
      "c4 e5 Nc3 f5 g3 Nf6 Bg2"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 g6",
      "c4 e5 Nc3 g6"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 g6",
      "c4 e5 Nc3 g6 g3 Bg7 Bg2"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 d6",
      "c4 e5 Nc3 d6"
    ],
    [
      "A21",
      "English: King's, Keres Variation",
      "c4 e5 Nc3 d6 g3 c6"
    ],
    [
      "A21",
      "English: King's, Keres Variation",
      "c4 e5 Nc3 d6 g3 c6 Bg2"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 d6 3.d4",
      "c4 e5 Nc3 d6 d4"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 d6 3.g3",
      "c4 e5 Nc3 d6 g3"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 d6 3.Nf3",
      "c4 e5 Nc3 d6 Nf3"
    ],
    [
      "A21",
      "English: King's, 2.Nc3 d6 3.Nf3 g6",
      "c4 e5 Nc3 d6 Nf3 g6"
    ],
    [
      "A21",
      "English: Lukin Variation",
      "c4 e5 Nc3 d6 Nf3 f5"
    ],
    [
      "A21",
      "English: Lukin, 4.d4 e4",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4"
    ],
    [
      "A21",
      "English: Lukin, 5.Nd2",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4 Nd2"
    ],
    [
      "A21",
      "English: Lukin, 5.Ng5",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4 Ng5"
    ],
    [
      "A21",
      "English: Lukin, 5.Ng5 Nf6",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4 Ng5 Nf6"
    ],
    [
      "A21",
      "English: Lukin, 5.Ng5 Be7",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4 Ng5 Be7"
    ],
    [
      "A21",
      "English: Lukin, 5.Ng5 c6",
      "c4 e5 Nc3 d6 Nf3 f5 d4 e4 Ng5 c6"
    ],
    [
      "A21",
      "English: Smyslov Defence",
      "c4 e5 Nc3 d6 Nf3 Bg4"
    ],
    [
      "A21",
      "English: Kramnik-Shirov Counterattack",
      "c4 e5 Nc3 Bb4"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.g3",
      "c4 e5 Nc3 Bb4 g3"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.g3 Bxc3",
      "c4 e5 Nc3 Bb4 g3 Bxc3"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.Nd5",
      "c4 e5 Nc3 Bb4 Nd5"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.Nd5 a5",
      "c4 e5 Nc3 Bb4 Nd5 a5"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.Nd5 Ba5",
      "c4 e5 Nc3 Bb4 Nd5 Ba5"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.Nd5 Bc5",
      "c4 e5 Nc3 Bb4 Nd5 Bc5"
    ],
    [
      "A21",
      "English: Kramnik-Shirov, 3.Nd5 Be7",
      "c4 e5 Nc3 Bb4 Nd5 Be7"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6",
      "c4 e5 Nc3 Nf6"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.e4",
      "c4 e5 Nc3 Nf6 e4"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.e3",
      "c4 e5 Nc3 Nf6 e3"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.e3 Bb4",
      "c4 e5 Nc3 Nf6 e3 Bb4"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.Nf3",
      "c4 e5 Nc3 Nf6 Nf3"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.Nf3 d6",
      "c4 e5 Nc3 Nf6 Nf3 d6"
    ],
    [
      "A22",
      "English: King's, 2.Nc3 Nf6 3.Nf3 e4",
      "c4 e5 Nc3 Nf6 Nf3 e4"
    ],
    [
      "A22",
      "English: Bellon Gambit",
      "c4 e5 Nc3 Nf6 Nf3 e4 Ng5 b5"
    ],
    [
      "A22",
      "English: Bremen System",
      "c4 e5 Nc3 Nf6 g3"
    ],
    [
      "A22",
      "English: Bremen, 3...Bc5",
      "c4 e5 Nc3 Nf6 g3 Bc5"
    ],
    [
      "A22",
      "English: Bremen, Reverse Dragon",
      "c4 e5 Nc3 Nf6 g3 d5"
    ],
    [
      "A22",
      "English: Bremen, Smyslov System",
      "c4 e5 Nc3 Nf6 g3 Bb4"
    ],
    [
      "A22",
      "English: Bremen, Smyslov, 4.Bg2",
      "c4 e5 Nc3 Nf6 g3 Bb4 Bg2"
    ],
    [
      "A23",
      "English: Bremen, Keres System",
      "c4 e5 Nc3 Nf6 g3 c6"
    ],
    [
      "A23",
      "English: Bremen, Keres, 4.Nf3",
      "c4 e5 Nc3 Nf6 g3 c6 Nf3"
    ],
    [
      "A23",
      "English: Bremen, Keres, 4.Nf3 d6",
      "c4 e5 Nc3 Nf6 g3 c6 Nf3 d6"
    ],
    [
      "A23",
      "English: Bremen, Keres, 4.Nf3 e4",
      "c4 e5 Nc3 Nf6 g3 c6 Nf3 e4"
    ],
    [
      "A23",
      "English: Bremen, Keres, 4.Bg2",
      "c4 e5 Nc3 Nf6 g3 c6 Bg2"
    ],
    [
      "A23",
      "English: Bremen, Keres, 4.Bg2 d5",
      "c4 e5 Nc3 Nf6 g3 c6 Bg2 d5"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2 Bg7 d3"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2 Bg7 e3"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2 Bg7 e4"
    ],
    [
      "A24",
      "English: Bremen, 3...g6",
      "c4 e5 Nc3 Nf6 g3 g6 Bg2 Bg7 e4 d6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 e3"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 e3 Nf6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 f5"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 f5 Bg2"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 f5 Bg2 Nf6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 f5 Bg2 Nf6 e3 g6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 f5 Bg2 Nf6 d3"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6 Bg2"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bc5"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bc5 e3"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bb4"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bb4 Nd5"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 d6 Bg2"
    ],
    [
      "A25",
      "English: Closed, Tr\u00f6ger Defence",
      "c4 e5 Nc3 Nc6 g3 d6 Bg2 Be6"
    ],
    [
      "A25",
      "English: Closed, Tr\u00f6ger, 5.d3",
      "c4 e5 Nc3 Nc6 g3 d6 Bg2 Be6 d3"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 g6"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 g6 Bg2"
    ],
    [
      "A25",
      "English: Closed",
      "c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7"
    ],
    [
      "A26",
      "English: Closed, 5.d3 d6",
      "c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6"
    ],
    [
      "A27",
      "English: Three Knights",
      "c4 e5 Nc3 Nc6 Nf3"
    ],
    [
      "A27",
      "English: Three Knights, 3...Bb4",
      "c4 e5 Nc3 Nc6 Nf3 Bb4"
    ],
    [
      "A27",
      "English: Three Knights, 3...d6",
      "c4 e5 Nc3 Nc6 Nf3 d6"
    ],
    [
      "A27",
      "English: Three Knights, 3...f5",
      "c4 e5 Nc3 Nc6 Nf3 f5"
    ],
    [
      "A27",
      "English: Three Knights, 3...f5 4.d4",
      "c4 e5 Nc3 Nc6 Nf3 f5 d4"
    ],
    [
      "A27",
      "English: Three Knights, 3...g6",
      "c4 e5 Nc3 Nc6 Nf3 g6"
    ],
    [
      "A27",
      "English: Three Knights, 3...g6 4.d4",
      "c4 e5 Nc3 Nc6 Nf3 g6 d4"
    ],
    [
      "A28",
      "English: Four Knights",
      "c4 e5 Nc3 Nc6 Nf3 Nf6"
    ],
    [
      "A29",
      "English: Four Knights, 4.g3",
      "c4 e5 Nc3 Nc6 Nf3 Nf6 g3"
    ],
    [
      "A29",
      "English: Four Knights, 4.g3 g6",
      "c4 e5 Nc3 Nc6 Nf3 Nf6 g3 g6"
    ],
    [
      "A29",
      "English: Four Knights, 4.g3 d5",
      "c4 e5 Nc3 Nc6 Nf3 Nf6 g3 d5"
    ],
    [
      "A29",
      "English: Four Knights, 4.g3 Bc5",
      "c4 e5 Nc3 Nc6 Nf3 Nf6 g3 Bc5"
    ],
    [
      "A29",
      "English: Four Knights, 4.g3 Bb4",
      "c4 e5 Nc3 Nc6 Nf3 Nf6 g3 Bb4"
    ],
    [
      "A30a",
      "English: Symmetrical",
      "c4 c5"
    ],
    [
      "A30a",
      "English: Symmetrical, 2.b3",
      "c4 c5 b3"
    ],
    [
      "A30a",
      "English: Symmetrical, 2.g3",
      "c4 c5 g3"
    ],
    [
      "A30a",
      "English: Symmetrical, 2.g3 g6",
      "c4 c5 g3 g6"
    ],
    [
      "A30b",
      "English: Symmetrical, 2.Nf3",
      "c4 c5 Nf3"
    ],
    [
      "A30b",
      "English: Symmetrical, 2.Nf3 b6",
      "c4 c5 Nf3 b6"
    ],
    [
      "A30b",
      "English: Symmetrical, 2.Nf3 b6 3.g3",
      "c4 c5 Nf3 b6 g3"
    ],
    [
      "A30b",
      "English: Symmetrical, 2.Nf3 g6",
      "c4 c5 Nf3 g6"
    ],
    [
      "A30b",
      "English: Symmetrical, 2.Nf3 Nc6",
      "c4 c5 Nf3 Nc6"
    ],
    [
      "A30c",
      "English: Symmetrical, 2.Nf3 Nf6",
      "c4 c5 Nf3 Nf6"
    ],
    [
      "A30d",
      "English: Symmetrical, 2.Nf3 Nf6 3.g3",
      "c4 c5 Nf3 Nf6 g3"
    ],
    [
      "A30e",
      "English: Symmetrical, b6 System",
      "c4 c5 Nf3 Nf6 g3 b6"
    ],
    [
      "A30e",
      "English: Symmetrical, b6 System",
      "c4 c5 Nf3 Nf6 g3 b6 Bg2 Bb7"
    ],
    [
      "A31",
      "English: Symmetrical, Two Knights",
      "c4 c5 Nf3 Nf6 d4"
    ],
    [
      "A31",
      "English: Symmetrical, Two Knights, 3...a6",
      "c4 c5 Nf3 Nf6 d4 a6"
    ],
    [
      "A31",
      "English: Symmetrical, Two Knights, 3...g6",
      "c4 c5 Nf3 Nf6 d4 g6"
    ],
    [
      "A31",
      "English: Symmetrical, Two Knights",
      "c4 c5 Nf3 Nf6 d4 cxd4"
    ],
    [
      "A31",
      "English: Symmetrical, Two Knights",
      "c4 c5 Nf3 Nf6 d4 cxd4 Nxd4"
    ],
    [
      "A34",
      "English: Symmetrical",
      "c4 c5 Nc3"
    ],
    [
      "A34",
      "English: Symmetrical, 2...b6",
      "c4 c5 Nc3 b6"
    ],
    [
      "A34",
      "English: Symmetrical, 2...b6",
      "c4 c5 Nc3 b6 Nf3"
    ],
    [
      "A34",
      "English: Symmetrical, 2...b6",
      "c4 c5 Nc3 b6 Nf3 Bb7"
    ],
    [
      "A34",
      "English: Symmetrical, 2...g6",
      "c4 c5 Nc3 g6"
    ],
    [
      "A34",
      "English: Symmetrical, 2...g6",
      "c4 c5 Nc3 g6 Nf3"
    ],
    [
      "A34",
      "English: Symmetrical, 2...g6",
      "c4 c5 Nc3 g6 g3"
    ],
    [
      "A34",
      "English: Symmetrical, 2...g6",
      "c4 c5 Nc3 g6 g3 Bg7 Bg2"
    ],
    [
      "A34",
      "English: Symmetrical, 2...Nf6",
      "c4 c5 Nc3 Nf6"
    ],
    [
      "A34",
      "English: Symmetrical, 2...Nf6",
      "c4 c5 Nc3 Nf6 g3 d5"
    ],
    [
      "A34",
      "English: Symmetrical, 2...Nf6 3.g3",
      "c4 c5 Nc3 Nf6 g3"
    ],
    [
      "A35a",
      "English: Symmetrical",
      "c4 c5 Nc3 Nc6"
    ],
    [
      "A35b",
      "English: Symmetrical, 2.Nc3 Nc6 3.e3",
      "c4 c5 Nc3 Nc6 e3"
    ],
    [
      "A35c",
      "English: Symmetrical, 2.Nc3 Nc6 3.Nf3",
      "c4 c5 Nc3 Nc6 Nf3"
    ],
    [
      "A35d",
      "English: Symmetrical, 2.Nc3 Nc6 3.Nf3 g6",
      "c4 c5 Nc3 Nc6 Nf3 g6"
    ],
    [
      "A35g",
      "English: Symmetrical, Four Knights",
      "c4 c5 Nc3 Nc6 Nf3 Nf6"
    ],
    [
      "A36a",
      "English: Symmetrical, 3.g3",
      "c4 c5 Nc3 Nc6 g3"
    ],
    [
      "A36b",
      "English: Symmetrical, 3.g3 Nf6",
      "c4 c5 Nc3 Nc6 g3 Nf6"
    ],
    [
      "A36c",
      "English: Symmetrical, 3.g3 e6",
      "c4 c5 Nc3 Nc6 g3 e6"
    ],
    [
      "A36c",
      "English: Symmetrical, 3.g3 e6 4.Nf3",
      "c4 c5 Nc3 Nc6 g3 e6 Nf3"
    ],
    [
      "A36e",
      "English: Symmetrical, 3.g3 g6",
      "c4 c5 Nc3 Nc6 g3 g6"
    ],
    [
      "A36e",
      "English: Symmetrical, 3.g3 g6",
      "c4 c5 Nc3 Nc6 g3 g6 Bg2"
    ],
    [
      "A36e",
      "English: Symmetrical, 3.g3 g6",
      "c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7"
    ],
    [
      "A40a",
      "Queen's Pawn Game",
      "d4"
    ],
    [
      "A40b",
      "Queen's Pawn: 1...c6",
      "d4 c6"
    ],
    [
      "A40b",
      "Queen's Pawn: 1...c6 2.Nf3",
      "d4 c6 Nf3"
    ],
    [
      "A40b",
      "Queen's Pawn: 1...c6 2.c4",
      "d4 c6 c4"
    ],
    [
      "A40b",
      "Queen's Pawn: Jadoul",
      "d4 c6 c4 b5"
    ],
    [
      "A40c",
      "Queen's Pawn: Polish Defence",
      "d4 b5"
    ],
    [
      "A40c",
      "Queen's Pawn: Polish Defence",
      "d4 b5 e4"
    ],
    [
      "A40c",
      "Queen's Pawn: Polish Defence",
      "d4 b5 e4 Bb7"
    ],
    [
      "A40c",
      "Queen's Pawn: Polish Defence, Spassky Gambit",
      "d4 b5 e4 Bb7 Bxb5"
    ],
    [
      "A40d",
      "Queen's Pawn: English Defence",
      "d4 b6"
    ],
    [
      "A40d",
      "Queen's Pawn: English Defence, 2.c4",
      "d4 b6 c4"
    ],
    [
      "A40d",
      "Queen's Pawn: English Defence, 2.c4 Bb7",
      "d4 b6 c4 Bb7"
    ],
    [
      "A40e",
      "Queen's Pawn: English Defence, 2.c4 e6",
      "d4 b6 c4 e6"
    ],
    [
      "A40f",
      "Queen's Pawn: English Defence, 3.a3",
      "d4 b6 c4 e6 a3"
    ],
    [
      "A40g",
      "Queen's Pawn: English Defence, 3.e4",
      "d4 b6 c4 e6 e4"
    ],
    [
      "A40h",
      "Queen's Pawn: English Defence, 3.Nc3",
      "d4 b6 c4 e6 Nc3"
    ],
    [
      "A40i",
      "Englund Gambit",
      "d4 e5"
    ],
    [
      "A40i",
      "Englund Gambit Accepted",
      "d4 e5 dxe5"
    ],
    [
      "A40i",
      "Englund Gambit: Soller",
      "d4 e5 dxe5 f6"
    ],
    [
      "A40i",
      "Englund Gambit: Hartlaub",
      "d4 e5 dxe5 d6"
    ],
    [
      "A40i",
      "Englund Gambit: 2.dxe5 Nc6",
      "d4 e5 dxe5 Nc6"
    ],
    [
      "A40i",
      "Englund Gambit: 2.dxe5 Nc6 3.Nf3",
      "d4 e5 dxe5 Nc6 Nf3"
    ],
    [
      "A40i",
      "Englund Gambit: Soller Deferred",
      "d4 e5 dxe5 Nc6 Nf3 f6"
    ],
    [
      "A40i",
      "Englund Gambit: Zilbermints",
      "d4 e5 dxe5 Nc6 Nf3 Nge7"
    ],
    [
      "A40i",
      "Englund Gambit: 2.dxe5 Nc6 3.Nf3 Qe7",
      "d4 e5 dxe5 Nc6 Nf3 Qe7"
    ],
    [
      "A40j",
      "Queen's Pawn: Bogoljubow-Miles Defence",
      "d4 Nc6"
    ],
    [
      "A40j",
      "Queen's Pawn: Bogoljubow-Miles, 2.Bg5",
      "d4 Nc6 Bg5"
    ],
    [
      "A40j",
      "Queen's Pawn: Bogoljubow-Miles, 2.d5",
      "d4 Nc6 d5"
    ],
    [
      "A40k",
      "Queen's Pawn: Bogoljubow-Miles, 2.c4",
      "d4 Nc6 c4"
    ],
    [
      "A40l",
      "Queen's Pawn: Bogoljubow-Miles, 2.Nf3",
      "d4 Nc6 Nf3"
    ],
    [
      "A40m",
      "Queen's Pawn: 1...e6",
      "d4 e6"
    ],
    [
      "A40n",
      "Queen's Pawn: 1...e6 2.Nf3",
      "d4 e6 Nf3"
    ],
    [
      "A40n",
      "Queen's Pawn: 1...e6 2.Nf3 c5",
      "d4 e6 Nf3 c5"
    ],
    [
      "A40o",
      "Queen's Pawn: 1...e6 2.c4",
      "d4 e6 c4"
    ],
    [
      "A40p",
      "Queen's Pawn: Keres Defence",
      "d4 e6 c4 Bb4+"
    ],
    [
      "A40q",
      "Queen's Pawn: Keres Defence, 3.Bd2",
      "d4 e6 c4 Bb4+ Bd2"
    ],
    [
      "A40s",
      "Queen's Pawn: Modern",
      "d4 g6"
    ],
    [
      "A40t",
      "Queen's Pawn: Modern",
      "d4 g6 Nf3"
    ],
    [
      "A40u",
      "Queen's Pawn: Modern",
      "d4 g6 c4"
    ],
    [
      "A40u",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7"
    ],
    [
      "A40v",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 e4"
    ],
    [
      "A40w",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 Nf3"
    ],
    [
      "A40w",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 Nf3 c5"
    ],
    [
      "A40x",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 Nc3"
    ],
    [
      "A40x",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 Nc3 c5"
    ],
    [
      "A40x",
      "Queen's Pawn: Modern",
      "d4 g6 c4 Bg7 Nc3 c5 d5"
    ],
    [
      "A41a",
      "Neo-Old Indian",
      "d4 d6"
    ],
    [
      "A41b",
      "Neo-Old Indian: 2.Bg5",
      "d4 d6 Bg5"
    ],
    [
      "A41c",
      "Neo-Old Indian: 2.g3",
      "d4 d6 g3"
    ],
    [
      "A41d",
      "Neo-Old Indian: 2.Nf3",
      "d4 d6 Nf3"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern",
      "d4 d6 Nf3 g6"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern: 3.Bf4",
      "d4 d6 Nf3 g6 Bf4"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern: 3.Bf4",
      "d4 d6 Nf3 g6 Bf4 Bg7"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern: 3.g3",
      "d4 d6 Nf3 g6 g3"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern: 3.g3",
      "d4 d6 Nf3 g6 g3 Bg7"
    ],
    [
      "A41e",
      "Neo-Old Indian / Modern: 3.g3",
      "d4 d6 Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A41f",
      "Neo-Old Indian: Wade Defence",
      "d4 d6 Nf3 Bg4"
    ],
    [
      "A41f",
      "Neo-Old Indian: Wade Defence, 3.e3",
      "d4 d6 Nf3 Bg4 e3"
    ],
    [
      "A41f",
      "Neo-Old Indian: Wade Defence, 3.e3 Nd7",
      "d4 d6 Nf3 Bg4 e3 Nd7"
    ],
    [
      "A41f",
      "Neo-Old Indian: Wade Defence, 3.e3 Nf6",
      "d4 d6 Nf3 Bg4 e3 Nf6"
    ],
    [
      "A41g",
      "Neo-Old Indian: Wade Defence, 3.c4",
      "d4 d6 Nf3 Bg4 c4"
    ],
    [
      "A41g",
      "Neo-Old Indian: Wade Defence, 3.c4 e5",
      "d4 d6 Nf3 Bg4 c4 e5"
    ],
    [
      "A41h",
      "Neo-Old Indian: Wade Defence, 3.c4 Nd7",
      "d4 d6 Nf3 Bg4 c4 Nd7"
    ],
    [
      "A41i",
      "Neo-Old Indian: Wade Defence, 3.c4 Bxf3",
      "d4 d6 Nf3 Bg4 c4 Bxf3"
    ],
    [
      "A41j",
      "Neo-Old Indian: Wade Defence, 3.e4",
      "d4 d6 Nf3 Bg4 e4"
    ],
    [
      "A41k",
      "Neo-Old Indian: Wade Defence, 3.e4 Nf6",
      "d4 d6 Nf3 Bg4 e4 Nf6"
    ],
    [
      "A41l",
      "Neo-Old Indian: 2.c4",
      "d4 d6 c4"
    ],
    [
      "A41m",
      "Neo-Old Indian: 2.c4 e5",
      "d4 d6 c4 e5"
    ],
    [
      "A41n",
      "Neo-Old Indian: 2.c4 e5 3.d5",
      "d4 d6 c4 e5 d5"
    ],
    [
      "A41o",
      "Neo-Old Indian: 2.c4 e5 3.dxe5",
      "d4 d6 c4 e5 dxe5"
    ],
    [
      "A41o",
      "Neo-Old Indian: Queenswap",
      "d4 d6 c4 e5 dxe5 dxe5 Qxd8+ Kxd8"
    ],
    [
      "A41p",
      "Neo-Old Indian: 2.c4 e5 3.Nf3",
      "d4 d6 c4 e5 Nf3"
    ],
    [
      "A41p",
      "Neo-Old Indian: 2.c4 e5 3.Nf3 e4",
      "d4 d6 c4 e5 Nf3 e4"
    ],
    [
      "A41q",
      "Neo-Old Indian: Modern",
      "d4 d6 c4 g6"
    ],
    [
      "A41q",
      "Neo-Old Indian: Modern, 3.e4",
      "d4 d6 c4 g6 e4"
    ],
    [
      "A41q",
      "Neo-Old Indian: Modern, 3.e4 Bg7",
      "d4 d6 c4 g6 e4 Bg7"
    ],
    [
      "A41r",
      "Neo-Old Indian: Modern, 3.Nf3",
      "d4 d6 c4 g6 Nf3"
    ],
    [
      "A41r",
      "Neo-Old Indian: Modern, 3.Nf3 Bg7",
      "d4 d6 c4 g6 Nf3 Bg7"
    ],
    [
      "A41r",
      "Neo-Old Indian: Modern, 3.Nf3 Bg7 4.g3",
      "d4 d6 c4 g6 Nf3 Bg7 g3"
    ],
    [
      "A41t",
      "Neo-Old Indian: Modern, 3.Nc3",
      "d4 d6 c4 g6 Nc3"
    ],
    [
      "A41t",
      "Neo-Old Indian: Modern, 3.Nc3 Bg7",
      "d4 d6 c4 g6 Nc3 Bg7"
    ],
    [
      "A42a",
      "Modern: Averbakh",
      "d4 d6 c4 g6 Nc3 Bg7 e4"
    ],
    [
      "A42c",
      "Modern: c4 Pterodactyl",
      "d4 d6 c4 g6 Nc3 Bg7 e4 c5"
    ],
    [
      "A42c",
      "Modern: c4 Pterodactyl",
      "d4 d6 c4 g6 Nc3 Bg7 e4 c5 Nf3"
    ],
    [
      "A42c",
      "Modern: c4 Pterodactyl",
      "d4 d6 c4 g6 Nc3 Bg7 e4 c5 Nf3 Qa5"
    ],
    [
      "A42d",
      "Modern: Averbakh, 4...c6",
      "d4 d6 c4 g6 Nc3 Bg7 e4 c6"
    ],
    [
      "A42f",
      "Modern: Averbakh, 4...Nd7",
      "d4 d6 c4 g6 Nc3 Bg7 e4 Nd7"
    ],
    [
      "A42g",
      "Modern: Averbakh, Kotov Variation",
      "d4 d6 c4 g6 Nc3 Bg7 e4 Nc6"
    ],
    [
      "A42n",
      "Modern: Averbakh, 4...e5",
      "d4 d6 c4 g6 Nc3 Bg7 e4 e5"
    ],
    [
      "A42t",
      "Modern: Averbakh, 4...e5 5.d5",
      "d4 d6 c4 g6 Nc3 Bg7 e4 e5 d5"
    ],
    [
      "A43a",
      "Old Benoni",
      "d4 c5"
    ],
    [
      "A43a",
      "Old Benoni: Nakamura Gambit",
      "d4 c5 b4"
    ],
    [
      "A43b",
      "Old Benoni: 2.dxc5",
      "d4 c5 dxc5"
    ],
    [
      "A43b",
      "Old Benoni: Cormorant Gambit",
      "d4 c5 dxc5 b6"
    ],
    [
      "A43c",
      "Old Benoni: 2.c3",
      "d4 c5 c3"
    ],
    [
      "A43d",
      "Old Benoni: 2.e3",
      "d4 c5 e3"
    ],
    [
      "A43e",
      "Old Benoni: 2.d5",
      "d4 c5 d5"
    ],
    [
      "A43e",
      "Old Benoni: 2.d5 b5",
      "d4 c5 d5 b5"
    ],
    [
      "A43f",
      "Old Benoni: 2.d5 e6",
      "d4 c5 d5 e6"
    ],
    [
      "A43g",
      "Old Benoni: Franco-Benoni",
      "d4 c5 d5 e6 e4"
    ],
    [
      "A43h",
      "Old Benoni: 2.d5 e6 3.c4",
      "d4 c5 d5 e6 c4"
    ],
    [
      "A43h",
      "Old Benoni: 2.d5 e6 3.c4",
      "d4 c5 d5 e6 c4 exd5 cxd5"
    ],
    [
      "A43h",
      "Old Benoni: 2.d5 e6 3.c4",
      "d4 c5 d5 e6 c4 exd5 cxd5 d6"
    ],
    [
      "A43h",
      "Old Benoni: 2.d5 e6 3.c4",
      "d4 c5 d5 e6 c4 exd5 cxd5 d6 e4"
    ],
    [
      "A43j",
      "Old Benoni: Clarendon Court Defence",
      "d4 c5 d5 f5"
    ],
    [
      "A43j",
      "Old Benoni: Clarendon Court, 3.c4",
      "d4 c5 d5 f5 c4"
    ],
    [
      "A43j",
      "Old Benoni: Clarendon Court, 3.g3",
      "d4 c5 d5 f5 g3"
    ],
    [
      "A43j",
      "Old Benoni: Clarendon Court, 3.Nc3",
      "d4 c5 d5 f5 Nc3"
    ],
    [
      "A43k",
      "Old Benoni: 2.d5 Nf6",
      "d4 c5 d5 Nf6"
    ],
    [
      "A43k",
      "Old Benoni: 2.d5 Nf6 3.Nc3",
      "d4 c5 d5 Nf6 Nc3"
    ],
    [
      "A43k",
      "Old Benoni: Woozle",
      "d4 c5 d5 Nf6 Nc3 Qa5"
    ],
    [
      "A43l",
      "Old Benoni: 2.d5 Nf6 3.Nf3",
      "d4 c5 d5 Nf6 Nf3"
    ],
    [
      "A43l",
      "Old Benoni: 2.d5 Nf6 3.Nf3 e6",
      "d4 c5 d5 Nf6 Nf3 e6"
    ],
    [
      "A43l",
      "Old Benoni: 2.d5 Nf6 3.Nf3 e6 4.Nc3",
      "d4 c5 d5 Nf6 Nf3 e6 Nc3"
    ],
    [
      "A43m",
      "Old Benoni: 2.d5 Nf6 3.Nf3 g6",
      "d4 c5 d5 Nf6 Nf3 g6"
    ],
    [
      "A43m",
      "Old Benoni: 2.d5 Nf6 3.Nf3 g6 4.Nc3",
      "d4 c5 d5 Nf6 Nf3 g6 Nc3"
    ],
    [
      "A43n",
      "Old Benoni: Neo-Benko",
      "d4 c5 d5 Nf6 Nf3 b5"
    ],
    [
      "A43o",
      "Old Benoni: Neo-Benko, 4.Bg5",
      "d4 c5 d5 Nf6 Nf3 b5 Bg5"
    ],
    [
      "A43p",
      "Old Benoni: Neo-Benko, 4.Bg5 d6",
      "d4 c5 d5 Nf6 Nf3 b5 Bg5 d6"
    ],
    [
      "A43q",
      "Old Benoni: Neo-Benko, 4.Bg5 Ne4",
      "d4 c5 d5 Nf6 Nf3 b5 Bg5 Ne4"
    ],
    [
      "A43r",
      "Old Benoni: Hawk",
      "d4 c5 d5 Nf6 Nf3 c4"
    ],
    [
      "A43r",
      "Old Benoni: Hawk, 4.e4",
      "d4 c5 d5 Nf6 Nf3 c4 e4"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt",
      "d4 c5 d5 d6"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.Nf3",
      "d4 c5 d5 d6 Nf3"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.Nf3 Nf6",
      "d4 c5 d5 d6 Nf3 Nf6"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.Nc3",
      "d4 c5 d5 d6 Nc3"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.Nc3 g6",
      "d4 c5 d5 d6 Nc3 g6"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.Nc3 Nf6",
      "d4 c5 d5 d6 Nc3 Nf6"
    ],
    [
      "A43s",
      "Old Benoni: Schmidt, 3.e4",
      "d4 c5 d5 d6 e4"
    ],
    [
      "A43t",
      "Old Benoni: Schmidt, 3.e4 g6",
      "d4 c5 d5 d6 e4 g6"
    ],
    [
      "A43t",
      "Old Benoni: Schmidt, 3.e4 g6",
      "d4 c5 d5 d6 e4 g6 Nf3 Bg7"
    ],
    [
      "A43t",
      "Old Benoni: Schmidt, 3.e4 g6",
      "d4 c5 d5 d6 e4 g6 Nf3 Bg7 Be2"
    ],
    [
      "A43t",
      "Old Benoni: Schmidt, 3.e4 g6",
      "d4 c5 d5 d6 e4 g6 Nc3 Bg7"
    ],
    [
      "A43u",
      "Old Benoni: Schmidt, 3.e4 Nf6",
      "d4 c5 d5 d6 e4 Nf6"
    ],
    [
      "A43u",
      "Old Benoni: Schmidt, 3.e4 Nf6",
      "d4 c5 d5 d6 e4 Nf6 Nc3"
    ],
    [
      "A43u",
      "Old Benoni: Schmidt, 3.e4 Nf6",
      "d4 c5 d5 d6 e4 Nf6 Nc3 g6"
    ],
    [
      "A43u",
      "Old Benoni: Schmidt, 3.e4 Nf6",
      "d4 c5 d5 d6 e4 Nf6 Nc3 g6 Nf3"
    ],
    [
      "A44a",
      "Old Benoni: Czech",
      "d4 c5 d5 e5"
    ],
    [
      "A44b",
      "Old Benoni: Czech, 3.dxe6",
      "d4 c5 d5 e5 dxe6"
    ],
    [
      "A44c",
      "Old Benoni: Czech, 3.c4",
      "d4 c5 d5 e5 c4"
    ],
    [
      "A44d",
      "Old Benoni: Czech, 3.c4 d6",
      "d4 c5 d5 e5 c4 d6"
    ],
    [
      "A44e",
      "Old Benoni: Czech, 3.c4 d6 4.e4",
      "d4 c5 d5 e5 c4 d6 e4"
    ],
    [
      "A44f",
      "Old Benoni: Czech, 3.c4 d6 4.e4 Be7",
      "d4 c5 d5 e5 c4 d6 e4 Be7"
    ],
    [
      "A44h",
      "Old Benoni: Czech, 3.c4 d6 4.e4 g6",
      "d4 c5 d5 e5 c4 d6 e4 g6"
    ],
    [
      "A44l",
      "Old Benoni: Czech, 3.e4",
      "d4 c5 d5 e5 e4"
    ],
    [
      "A44m",
      "Old Benoni: Czech, 3.e4 d6",
      "d4 c5 d5 e5 e4 d6"
    ],
    [
      "A44n",
      "Old Benoni: Czech, 3.e4 d6 4.Nf3",
      "d4 c5 d5 e5 e4 d6 Nf3"
    ],
    [
      "A44o",
      "Old Benoni: Czech, 3.e4 d6 4.Bb5+",
      "d4 c5 d5 e5 e4 d6 Bb5+"
    ],
    [
      "A44p",
      "Old Benoni: Czech, 3.e4 d6 4.Bd3",
      "d4 c5 d5 e5 e4 d6 Bd3"
    ],
    [
      "A44q",
      "Old Benoni: Czech, 3.e4 d6 4.Nc3",
      "d4 c5 d5 e5 e4 d6 Nc3"
    ],
    [
      "A44s",
      "Old Benoni: Czech, 3.e4 d6 4.Nc3 g6",
      "d4 c5 d5 e5 e4 d6 Nc3 g6"
    ],
    [
      "A44t",
      "Old Benoni: Czech, 3.e4 d6 4.Nc3 a6",
      "d4 c5 d5 e5 e4 d6 Nc3 a6"
    ],
    [
      "A45a",
      "Queen's Pawn: Indian",
      "d4 Nf6"
    ],
    [
      "A45a",
      "Indian: Paleface Attack",
      "d4 Nf6 f3"
    ],
    [
      "A45a",
      "Indian: Blackmar-Diemer Gambit (without Nc3)",
      "d4 Nf6 f3 d5 e4"
    ],
    [
      "A45a",
      "Indian: Gedult Attack",
      "d4 Nf6 f3 d5 g4"
    ],
    [
      "A45a",
      "Indian: Omega Gambit",
      "d4 Nf6 e4"
    ],
    [
      "A45a",
      "Indian: Arafat Gambit",
      "d4 Nf6 e4 Nxe4 Bd3 Nf6 Nf3"
    ],
    [
      "A45a",
      "Indian: Gibbins Gambit",
      "d4 Nf6 g4"
    ],
    [
      "A45a",
      "Indian: Gibbins Gambit, Oshima Defence",
      "d4 Nf6 g4 e5"
    ],
    [
      "A45a",
      "Indian: Gibbins Gambit Accepted",
      "d4 Nf6 g4 Nxg4"
    ],
    [
      "A45b",
      "Indian: Canard Opening",
      "d4 Nf6 f4"
    ],
    [
      "A45c",
      "Indian: 2.Nd2",
      "d4 Nf6 Nd2"
    ],
    [
      "A45c",
      "Indian: Lazard Gambit",
      "d4 Nf6 Nd2 e5"
    ],
    [
      "A45d",
      "Indian: 2.e3",
      "d4 Nf6 e3"
    ],
    [
      "A45d",
      "Indian: 2.e3 e6",
      "d4 Nf6 e3 e6"
    ],
    [
      "A45d",
      "Indian: 2.e3 g6",
      "d4 Nf6 e3 g6"
    ],
    [
      "A45e",
      "Indian: 2.c3",
      "d4 Nf6 c3"
    ],
    [
      "A45e",
      "Indian: 2.c3 g6",
      "d4 Nf6 c3 g6"
    ],
    [
      "A45e",
      "Indian: 2.c3 g6 3.Bg5",
      "d4 Nf6 c3 g6 Bg5"
    ],
    [
      "A45f",
      "Indian: 2.Nc3",
      "d4 Nf6 Nc3"
    ],
    [
      "A45g",
      "Indian: 2.Bf4",
      "d4 Nf6 Bf4"
    ],
    [
      "A45h",
      "Indian: 2.g3",
      "d4 Nf6 g3"
    ],
    [
      "A45h",
      "Indian: 2.g3 g6",
      "d4 Nf6 g3 g6"
    ],
    [
      "A45i",
      "Indian: 2.g3 c5",
      "d4 Nf6 g3 c5"
    ],
    [
      "A45i",
      "Indian: 2.g3 c5 3.d5 b5",
      "d4 Nf6 g3 c5 d5 b5"
    ],
    [
      "A45j",
      "Trompowsky Opening",
      "d4 Nf6 Bg5"
    ],
    [
      "A45j",
      "Trompowsky 2...d6",
      "d4 Nf6 Bg5 d6"
    ],
    [
      "A45j",
      "Trompowsky 2...d6 3.Nc3",
      "d4 Nf6 Bg5 d6 Nc3"
    ],
    [
      "A45j",
      "Trompowsky 2...d6 3.Bxf6",
      "d4 Nf6 Bg5 d6 Bxf6"
    ],
    [
      "A45k",
      "Trompowsky 2...g6",
      "d4 Nf6 Bg5 g6"
    ],
    [
      "A45k",
      "Trompowsky 2...g6 3.Nc3",
      "d4 Nf6 Bg5 g6 Nc3"
    ],
    [
      "A45k",
      "Trompowsky 2...g6 3.Bxf6",
      "d4 Nf6 Bg5 g6 Bxf6"
    ],
    [
      "A45l",
      "Trompowsky 2...g6 3.Bxf6 exf6 4.e3",
      "d4 Nf6 Bg5 g6 Bxf6 exf6 e3"
    ],
    [
      "A45m",
      "Trompowsky: 2...e6",
      "d4 Nf6 Bg5 e6"
    ],
    [
      "A45m",
      "Trompowsky: 2...e6 3.Nc3",
      "d4 Nf6 Bg5 e6 Nc3"
    ],
    [
      "A45m",
      "Trompowsky: 2...e6 3.e3",
      "d4 Nf6 Bg5 e6 e3"
    ],
    [
      "A45m",
      "Trompowsky: 2...e6 3.Nd2",
      "d4 Nf6 Bg5 e6 Nd2"
    ],
    [
      "A45n",
      "Trompowsky: 2...e6 3.e4",
      "d4 Nf6 Bg5 e6 e4"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5",
      "d4 Nf6 Bg5 c5"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5 3.dxc5",
      "d4 Nf6 Bg5 c5 dxc5"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5 3.Nc3",
      "d4 Nf6 Bg5 c5 Nc3"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5 3.d5",
      "d4 Nf6 Bg5 c5 d5"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5 3.d5 Qb6",
      "d4 Nf6 Bg5 c5 d5 Qb6"
    ],
    [
      "A45p",
      "Trompowsky: 2...c5 3.d5 Qb6 4.Nc3",
      "d4 Nf6 Bg5 c5 d5 Qb6 Nc3"
    ],
    [
      "A45q",
      "Trompowsky: 2...c5 3.Bxf6",
      "d4 Nf6 Bg5 c5 Bxf6"
    ],
    [
      "A45q",
      "Trompowsky: 2...c5 3.Bxf6 gxf6",
      "d4 Nf6 Bg5 c5 Bxf6 gxf6"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4",
      "d4 Nf6 Bg5 Ne4"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4 3.h4",
      "d4 Nf6 Bg5 Ne4 h4"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4 3.h4 d5",
      "d4 Nf6 Bg5 Ne4 h4 d5"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4 3.h4 c5",
      "d4 Nf6 Bg5 Ne4 h4 c5"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4 3.h4 c5 4.dxc5",
      "d4 Nf6 Bg5 Ne4 h4 c5 dxc5"
    ],
    [
      "A45s",
      "Trompowsky: 2...Ne4 3.h4 c5 4.d5",
      "d4 Nf6 Bg5 Ne4 h4 c5 d5"
    ],
    [
      "A45t",
      "Trompowsky: 2...Ne4 3.Bh4",
      "d4 Nf6 Bg5 Ne4 Bh4"
    ],
    [
      "A45t",
      "Trompowsky: 2...Ne4 3.Bh4 g5",
      "d4 Nf6 Bg5 Ne4 Bh4 g5"
    ],
    [
      "A45t",
      "Trompowsky: 2...Ne4 3.Bh4 d5",
      "d4 Nf6 Bg5 Ne4 Bh4 d5"
    ],
    [
      "A45t",
      "Trompowsky: 2...Ne4 3.Bh4 c5",
      "d4 Nf6 Bg5 Ne4 Bh4 c5"
    ],
    [
      "A45t",
      "Trompowsky: 2...Ne4 3.Bh4 c5 4.f3",
      "d4 Nf6 Bg5 Ne4 Bh4 c5 f3"
    ],
    [
      "A45u",
      "Trompowsky: 2...Ne4 3.Bf4",
      "d4 Nf6 Bg5 Ne4 Bf4"
    ],
    [
      "A45u",
      "Trompowsky: Borg Variation",
      "d4 Nf6 Bg5 Ne4 Bf4 g5"
    ],
    [
      "A45u",
      "Trompowsky: 2...Ne4 3.Bf4 d5",
      "d4 Nf6 Bg5 Ne4 Bf4 d5"
    ],
    [
      "A45u",
      "Trompowsky: 2...Ne4 3.Bf4 d5 4.Nd2",
      "d4 Nf6 Bg5 Ne4 Bf4 d5 Nd2"
    ],
    [
      "A45v",
      "Trompowsky: 2...Ne4 3.Bf4 d5 4.f3",
      "d4 Nf6 Bg5 Ne4 Bf4 d5 f3"
    ],
    [
      "A45w",
      "Trompowsky: 2...Ne4 3.Bf4 d5 4.e3",
      "d4 Nf6 Bg5 Ne4 Bf4 d5 e3"
    ],
    [
      "A45x",
      "Trompowsky: 2...Ne4 3.Bf4 c5",
      "d4 Nf6 Bg5 Ne4 Bf4 c5"
    ],
    [
      "A45x",
      "Trompowsky: 2...Ne4 3.Bf4 c5 4.d5",
      "d4 Nf6 Bg5 Ne4 Bf4 c5 d5"
    ],
    [
      "A45y",
      "Trompowsky: 2...Ne4 3.Bf4 c5 4.f3",
      "d4 Nf6 Bg5 Ne4 Bf4 c5 f3"
    ],
    [
      "A46a",
      "Indian: 2.Nf3",
      "d4 Nf6 Nf3"
    ],
    [
      "A46a",
      "Indian: D\u00f6ry Defence",
      "d4 Nf6 Nf3 Ne4"
    ],
    [
      "A46b",
      "Indian: 2.Nf3 b5",
      "d4 Nf6 Nf3 b5"
    ],
    [
      "A46b",
      "Indian: 2.Nf3 b5 3.g3",
      "d4 Nf6 Nf3 b5 g3"
    ],
    [
      "A46c",
      "Neo-Benoni",
      "d4 Nf6 Nf3 c5"
    ],
    [
      "A46c",
      "Neo-Benoni 3.dxc5",
      "d4 Nf6 Nf3 c5 dxc5"
    ],
    [
      "A46c",
      "Neo-Benoni: 3.e3",
      "d4 Nf6 Nf3 c5 e3"
    ],
    [
      "A46c",
      "Neo-Benoni: 3.e3 cxd4",
      "d4 Nf6 Nf3 c5 e3 cxd4"
    ],
    [
      "A46d",
      "Neo-Benoni: 3.c3",
      "d4 Nf6 Nf3 c5 c3"
    ],
    [
      "A46d",
      "Neo-Benoni: 3.c3 cxd4",
      "d4 Nf6 Nf3 c5 c3 cxd4"
    ],
    [
      "A46d",
      "Neo-Benoni: 3.c3 b6",
      "d4 Nf6 Nf3 c5 c3 b6"
    ],
    [
      "A46d",
      "Neo-Benoni: 3.c3 g6",
      "d4 Nf6 Nf3 c5 c3 g6"
    ],
    [
      "A46e",
      "Neo-Benoni: 3.c3 e6",
      "d4 Nf6 Nf3 c5 c3 e6"
    ],
    [
      "A46f",
      "Neo-Benoni: 3.g3",
      "d4 Nf6 Nf3 c5 g3"
    ],
    [
      "A46f",
      "Neo-Benoni: 3.g3 cxd4",
      "d4 Nf6 Nf3 c5 g3 cxd4"
    ],
    [
      "A46f",
      "Neo-Benoni: 3.g3 cxd4 4.Nxd4",
      "d4 Nf6 Nf3 c5 g3 cxd4 Nxd4"
    ],
    [
      "A46g",
      "Indian: 2.Nf3 d6",
      "d4 Nf6 Nf3 d6"
    ],
    [
      "A46h",
      "Indian: 2.Nf3 d6 3.g3",
      "d4 Nf6 Nf3 d6 g3"
    ],
    [
      "A46i",
      "Indian: 2.Nf3 d6 3.Bg5",
      "d4 Nf6 Nf3 d6 Bg5"
    ],
    [
      "A46j",
      "Indian: 2.Nf3 e6",
      "d4 Nf6 Nf3 e6"
    ],
    [
      "A46j",
      "Indian: 2.Nf3 e6 3.c3",
      "d4 Nf6 Nf3 e6 c3"
    ],
    [
      "A46j",
      "Indian: 2.Nf3 e6 3.c3 b6",
      "d4 Nf6 Nf3 e6 c3 b6"
    ],
    [
      "A46k",
      "Indian: 1.d4 Nf6 2.Nf3 e6 3.e3",
      "d4 Nf6 Nf3 e6 e3"
    ],
    [
      "A46k",
      "Indian: 1.d4 Nf6 2.Nf3 e6 3.e3 c5",
      "d4 Nf6 Nf3 e6 e3 c5"
    ],
    [
      "A46m",
      "Indian: 1.d4 Nf6 2.Nf3 e6 3.g3",
      "d4 Nf6 Nf3 e6 g3"
    ],
    [
      "A46m",
      "Indian: 1.d4 Nf6 2.Nf3 e6 3.g3 b5",
      "d4 Nf6 Nf3 e6 g3 b5"
    ],
    [
      "A46o",
      "Indian: 1.d4 Nf6 2.Nf3 e6 3.g3 c5",
      "d4 Nf6 Nf3 e6 g3 c5"
    ],
    [
      "A46p",
      "Indian: London System",
      "d4 Nf6 Nf3 e6 Bf4"
    ],
    [
      "A46p",
      "Indian: London, 3...c5",
      "d4 Nf6 Nf3 e6 Bf4 c5"
    ],
    [
      "A46p",
      "Indian: London, 3...c5 4.e3",
      "d4 Nf6 Nf3 e6 Bf4 c5 e3"
    ],
    [
      "A46q",
      "Indian: London, 3...c5 4.c3",
      "d4 Nf6 Nf3 e6 Bf4 c5 c3"
    ],
    [
      "A46r",
      "Torre Attack",
      "d4 Nf6 Nf3 e6 Bg5"
    ],
    [
      "A46r",
      "Torre Attack: 3...b6",
      "d4 Nf6 Nf3 e6 Bg5 b6"
    ],
    [
      "A46r",
      "Torre Attack: 3...Be7",
      "d4 Nf6 Nf3 e6 Bg5 Be7"
    ],
    [
      "A46s",
      "Torre Attack: 3...c5",
      "d4 Nf6 Nf3 e6 Bg5 c5"
    ],
    [
      "A46s",
      "Torre Attack: Wagner Gambit",
      "d4 Nf6 Nf3 e6 Bg5 c5 e4"
    ],
    [
      "A46t",
      "Torre Attack: 3...c5 4.c3",
      "d4 Nf6 Nf3 e6 Bg5 c5 c3"
    ],
    [
      "A46t",
      "Torre Attack: 3...c5 4.c3 Qb6",
      "d4 Nf6 Nf3 e6 Bg5 c5 c3 Qb6"
    ],
    [
      "A46t",
      "Torre Attack: 3...c5 4.c3 h6",
      "d4 Nf6 Nf3 e6 Bg5 c5 c3 h6"
    ],
    [
      "A46u",
      "Torre Attack: 3...c5 4.e3",
      "d4 Nf6 Nf3 e6 Bg5 c5 e3"
    ],
    [
      "A46u",
      "Torre Attack: 3...c5 4.e3 cxd4",
      "d4 Nf6 Nf3 e6 Bg5 c5 e3 cxd4"
    ],
    [
      "A46u",
      "Torre Attack: 3...c5 4.e3 Qb6",
      "d4 Nf6 Nf3 e6 Bg5 c5 e3 Qb6"
    ],
    [
      "A46v",
      "Torre Attack: 3...c5 4.e3 Be7",
      "d4 Nf6 Nf3 e6 Bg5 c5 e3 Be7"
    ],
    [
      "A46w",
      "Torre Attack: 3...c5 4.e3 h6",
      "d4 Nf6 Nf3 e6 Bg5 c5 e3 h6"
    ],
    [
      "A46x",
      "Torre Attack: 3...h6",
      "d4 Nf6 Nf3 e6 Bg5 h6"
    ],
    [
      "A46x",
      "Torre Attack: 3...h6 4.Bh4",
      "d4 Nf6 Nf3 e6 Bg5 h6 Bh4"
    ],
    [
      "A46x",
      "Torre Attack: 3...h6 4.Bh4 g5",
      "d4 Nf6 Nf3 e6 Bg5 h6 Bh4 g5"
    ],
    [
      "A46y",
      "Torre Attack: 3...h6 4.Bxf6",
      "d4 Nf6 Nf3 e6 Bg5 h6 Bxf6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 e6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 e6 e3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 e6 e3 c5"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 Bb7"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 Bb7 e3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bf4 Bb7 e3 e6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bg5"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 Bg5 Bb7"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 e6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 e6 Bd3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 e6 Bd3 c5"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 Bb7"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 Bb7 Bd3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 Bb7 Bd3 e6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 Bb7 Bd3 e6 O-O"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 e3 Bb7 Bd3 e6 O-O c5"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 g3"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 g3 e6"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 g3 Bb7 Bg2"
    ],
    [
      "A47",
      "Neo-Queen's Indian",
      "d4 Nf6 Nf3 b6 g3 Bb7 Bg2 e6"
    ],
    [
      "A48a",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6"
    ],
    [
      "A48a",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 Nbd2"
    ],
    [
      "A48b",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 c3"
    ],
    [
      "A48b",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 c3 Bg7"
    ],
    [
      "A48c",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 e3"
    ],
    [
      "A48c",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 e3 Bg7"
    ],
    [
      "A48d",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 e3 c5"
    ],
    [
      "A48e",
      "Neo-King's Indian",
      "d4 Nf6 Nf3 g6 Nc3"
    ],
    [
      "A48f",
      "Neo-King's Indian: London System",
      "d4 Nf6 Nf3 g6 Bf4"
    ],
    [
      "A48g",
      "Neo-King's Indian: London System",
      "d4 Nf6 Nf3 g6 Bf4 Bg7"
    ],
    [
      "A48h",
      "Neo-King's Indian: London System",
      "d4 Nf6 Nf3 g6 Bf4 Bg7 Nbd2"
    ],
    [
      "A48i",
      "Neo-King's Indian: London System",
      "d4 Nf6 Nf3 g6 Bf4 Bg7 c3"
    ],
    [
      "A48j",
      "Neo-King's Indian: London System",
      "d4 Nf6 Nf3 g6 Bf4 Bg7 e3"
    ],
    [
      "A48m",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5"
    ],
    [
      "A48n",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Ne4"
    ],
    [
      "A48o",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Bg7"
    ],
    [
      "A48o",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Bg7 c3"
    ],
    [
      "A48o",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Bg7 e3"
    ],
    [
      "A48p",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Bg7 Nc3"
    ],
    [
      "A48q",
      "Neo-King's Indian: Torre Attack",
      "d4 Nf6 Nf3 g6 Bg5 Bg7 Nbd2"
    ],
    [
      "A49",
      "Neo-King's Indian: Fianchetto System",
      "d4 Nf6 Nf3 g6 g3"
    ],
    [
      "A49",
      "Neo-King's Indian: Fianchetto System",
      "d4 Nf6 Nf3 g6 g3 Bg7"
    ],
    [
      "A49",
      "Neo-King's Indian: Fianchetto System",
      "d4 Nf6 Nf3 g6 g3 Bg7 Bg2"
    ],
    [
      "A50a",
      "Indian: 2.c4",
      "d4 Nf6 c4"
    ],
    [
      "A50b",
      "Indian: Mexican Defence (Two Knights Tango)",
      "d4 Nf6 c4 Nc6"
    ],
    [
      "A50c",
      "Indian: Mexican Defence, 3.Nc3",
      "d4 Nf6 c4 Nc6 Nc3"
    ],
    [
      "A50d",
      "Indian: Mexican Defence, 3.Nf3",
      "d4 Nf6 c4 Nc6 Nf3"
    ],
    [
      "A50d",
      "Indian: Mexican Defence, 3.Nf3 d6",
      "d4 Nf6 c4 Nc6 Nf3 d6"
    ],
    [
      "A50e",
      "Indian: Mexican Defence, 3.Nf3 e6",
      "d4 Nf6 c4 Nc6 Nf3 e6"
    ],
    [
      "A50h",
      "Indian: Slav-Indian",
      "d4 Nf6 c4 c6"
    ],
    [
      "A50i",
      "Indian: Slav-Indian, 3.Nf3",
      "d4 Nf6 c4 c6 Nf3"
    ],
    [
      "A50j",
      "Indian: Slav-Indian, 3.Nc3",
      "d4 Nf6 c4 c6 Nc3"
    ],
    [
      "A50k",
      "Indian: 2.c4 a6",
      "d4 Nf6 c4 a6"
    ],
    [
      "A50l",
      "Indian: Queen's Indian Accelerated",
      "d4 Nf6 c4 b6"
    ],
    [
      "A50m",
      "Indian: Queen's Indian Accelerated",
      "d4 Nf6 c4 b6 Nc3 Bb7"
    ],
    [
      "A51a",
      "Budapest",
      "d4 Nf6 c4 e5"
    ],
    [
      "A51b",
      "Budapest: 3.e3",
      "d4 Nf6 c4 e5 e3"
    ],
    [
      "A51c",
      "Budapest: 3.d5",
      "d4 Nf6 c4 e5 d5"
    ],
    [
      "A51d",
      "Budapest: 3.dxe5",
      "d4 Nf6 c4 e5 dxe5"
    ],
    [
      "A51d",
      "Budapest: Fajarowicz",
      "d4 Nf6 c4 e5 dxe5 Ne4"
    ],
    [
      "A51f",
      "Budapest: Fajarowicz, 4.Nd2",
      "d4 Nf6 c4 e5 dxe5 Ne4 Nd2"
    ],
    [
      "A51g",
      "Budapest: Fajarowicz, 4.a3",
      "d4 Nf6 c4 e5 dxe5 Ne4 a3"
    ],
    [
      "A51h",
      "Budapest: Fajarowicz, 4.Nf3",
      "d4 Nf6 c4 e5 dxe5 Ne4 Nf3"
    ],
    [
      "A52a",
      "Budapest: 3...Ng4",
      "d4 Nf6 c4 e5 dxe5 Ng4"
    ],
    [
      "A52b",
      "Budapest: 3...Ng4 4.e3",
      "d4 Nf6 c4 e5 dxe5 Ng4 e3"
    ],
    [
      "A52c",
      "Budapest: Alekhine Variation",
      "d4 Nf6 c4 e5 dxe5 Ng4 e4"
    ],
    [
      "A52c",
      "Budapest: Alekhine, Balogh Gambit",
      "d4 Nf6 c4 e5 dxe5 Ng4 e4 d6"
    ],
    [
      "A52e",
      "Budapest: Adler Variation",
      "d4 Nf6 c4 e5 dxe5 Ng4 Nf3"
    ],
    [
      "A52f",
      "Budapest: Adler, 4...Bc5",
      "d4 Nf6 c4 e5 dxe5 Ng4 Nf3 Bc5"
    ],
    [
      "A52h",
      "Budapest: Rubinstein Variation",
      "d4 Nf6 c4 e5 dxe5 Ng4 Bf4"
    ],
    [
      "A52i",
      "Budapest: Rubinstein, 4...Bb4+",
      "d4 Nf6 c4 e5 dxe5 Ng4 Bf4 Bb4+"
    ],
    [
      "A52j",
      "Budapest: Rubinstein, 4...Nc6",
      "d4 Nf6 c4 e5 dxe5 Ng4 Bf4 Nc6"
    ],
    [
      "A53",
      "Old Indian",
      "d4 Nf6 c4 d6"
    ],
    [
      "A53",
      "Old Indian: 3.g3",
      "d4 Nf6 c4 d6 g3"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3",
      "d4 Nf6 c4 d6 Nf3"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 c6",
      "d4 Nf6 c4 d6 Nf3 c6"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 Nbd7",
      "d4 Nf6 c4 d6 Nf3 Nbd7"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 Bf5",
      "d4 Nf6 c4 d6 Nf3 Bf5"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 Bg4",
      "d4 Nf6 c4 d6 Nf3 Bg4"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 Bg4 4.Qb3",
      "d4 Nf6 c4 d6 Nf3 Bg4 Qb3"
    ],
    [
      "A53",
      "Old Indian: 3.Nf3 Bg4 4.Nc3",
      "d4 Nf6 c4 d6 Nf3 Bg4 Nc3"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3",
      "d4 Nf6 c4 d6 Nc3"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3 c6",
      "d4 Nf6 c4 d6 Nc3 c6"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3 Nbd7",
      "d4 Nf6 c4 d6 Nc3 Nbd7"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3 Nbd7 4.Nf3",
      "d4 Nf6 c4 d6 Nc3 Nbd7 Nf3"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3 Nbd7 4.e4",
      "d4 Nf6 c4 d6 Nc3 Nbd7 e4"
    ],
    [
      "A53",
      "Old Indian: 3.Nc3 Nbd7 4.e4 e5",
      "d4 Nf6 c4 d6 Nc3 Nbd7 e4 e5"
    ],
    [
      "A53",
      "Old Indian: Janowski",
      "d4 Nf6 c4 d6 Nc3 Bf5"
    ],
    [
      "A53",
      "Old Indian: Ukrainian",
      "d4 Nf6 c4 d6 Nc3 e5"
    ],
    [
      "A53",
      "Old Indian: Ukranian, 4.e4",
      "d4 Nf6 c4 d6 Nc3 e5 e4"
    ],
    [
      "A53",
      "Old Indian: Ukranian, 4.e3",
      "d4 Nf6 c4 d6 Nc3 e5 e3"
    ],
    [
      "A53",
      "Old Indian: Dus-Khotimirsky",
      "d4 Nf6 c4 d6 Nc3 e5 e3 Nbd7 Bd3"
    ],
    [
      "A53",
      "Old Indian: Ukrainian, 4.d5",
      "d4 Nf6 c4 d6 Nc3 e5 d5"
    ],
    [
      "A53",
      "Old Indian: Ukrainian, 4.d5 Be7",
      "d4 Nf6 c4 d6 Nc3 e5 d5 Be7"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3 exd4",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 exd4"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3 Nc6",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nc6"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3 e4",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 e4"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3 e4 5.Ng5",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 e4 Ng5"
    ],
    [
      "A54",
      "Old Indian: 4.Nf3 Nbd7",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nbd7"
    ],
    [
      "A55a",
      "Old Indian: 5.e4",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nbd7 e4"
    ],
    [
      "A55b",
      "Old Indian: 5.e4 g6",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nbd7 e4 g6"
    ],
    [
      "A55c",
      "Old Indian: 5.e4 c6",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nbd7 e4 c6"
    ],
    [
      "A55d",
      "Old Indian: 5.e4 Be7",
      "d4 Nf6 c4 d6 Nc3 e5 Nf3 Nbd7 e4 Be7"
    ],
    [
      "A56a",
      "Benoni: 2...c5",
      "d4 Nf6 c4 c5"
    ],
    [
      "A56b",
      "Benoni: 2...c5 3.e3",
      "d4 Nf6 c4 c5 e3"
    ],
    [
      "A56b",
      "Benoni: 2...c5 3.e3 e6",
      "d4 Nf6 c4 c5 e3 e6"
    ],
    [
      "A56c",
      "Benoni: 2...c5 3.e3 g6",
      "d4 Nf6 c4 c5 e3 g6"
    ],
    [
      "A56d",
      "Benoni: 2...c5 3.e3 g6 4.Nc3",
      "d4 Nf6 c4 c5 e3 g6 Nc3"
    ],
    [
      "A56e",
      "Benoni: 3.dxc5",
      "d4 Nf6 c4 c5 dxc5"
    ],
    [
      "A56f",
      "Benoni: 3.d5",
      "d4 Nf6 c4 c5 d5"
    ],
    [
      "A56g",
      "Benoni: 3.d5 a6",
      "d4 Nf6 c4 c5 d5 a6"
    ],
    [
      "A56h",
      "Benoni: 3.d5 g6",
      "d4 Nf6 c4 c5 d5 g6"
    ],
    [
      "A56h",
      "Benoni: 3.d5 g6",
      "d4 Nf6 c4 c5 d5 g6 Nc3"
    ],
    [
      "A56i",
      "Benoni: 3.d5 d6",
      "d4 Nf6 c4 c5 d5 d6"
    ],
    [
      "A56j",
      "Benoni: 3.d5 d6 4.Nc3 g6",
      "d4 Nf6 c4 c5 d5 d6 Nc3 g6"
    ],
    [
      "A56j",
      "Benoni: Bronstein's Gambit",
      "d4 Nf6 c4 c5 d5 g6 Nc3 d6 e4 b5"
    ],
    [
      "A56n",
      "Benoni: Vulture",
      "d4 Nf6 c4 c5 d5 Ne4"
    ],
    [
      "A56o",
      "Benoni: Czech",
      "d4 Nf6 c4 c5 d5 e5"
    ],
    [
      "A56p",
      "Benoni: Czech, 4.Nc3 d6",
      "d4 Nf6 c4 c5 d5 e5 Nc3 d6"
    ],
    [
      "A57a",
      "Benko Gambit",
      "d4 Nf6 c4 c5 d5 b5"
    ],
    [
      "A57b",
      "Benko Gambit: 4.a4",
      "d4 Nf6 c4 c5 d5 b5 a4"
    ],
    [
      "A57c",
      "Benko Gambit: 4.Nd2",
      "d4 Nf6 c4 c5 d5 b5 Nd2"
    ],
    [
      "A57d",
      "Benko Gambit: 4.Nf3",
      "d4 Nf6 c4 c5 d5 b5 Nf3"
    ],
    [
      "A57d",
      "Benko Gambit: 4.Nf3 bxc4",
      "d4 Nf6 c4 c5 d5 b5 Nf3 bxc4"
    ],
    [
      "A57e",
      "Benko Gambit: 4.Nf3 Bb7",
      "d4 Nf6 c4 c5 d5 b5 Nf3 Bb7"
    ],
    [
      "A57e",
      "Benko Gambit: 4.Nf3 Bb7 5.a4",
      "d4 Nf6 c4 c5 d5 b5 Nf3 Bb7 a4"
    ],
    [
      "A57f",
      "Benko Gambit: 4.Nf3 g6",
      "d4 Nf6 c4 c5 d5 b5 Nf3 g6"
    ],
    [
      "A57h",
      "Benko Gambit: 4.cxb5",
      "d4 Nf6 c4 c5 d5 b5 cxb5"
    ],
    [
      "A57h",
      "Benko Gambit: 4.cxb5 a6",
      "d4 Nf6 c4 c5 d5 b5 cxb5 a6"
    ],
    [
      "A57i",
      "Benko Gambit: 4.cxb5 a6 5.b6",
      "d4 Nf6 c4 c5 d5 b5 cxb5 a6 b6"
    ],
    [
      "A57m",
      "Benko Gambit: 4.cxb5 a6 5.e3",
      "d4 Nf6 c4 c5 d5 b5 cxb5 a6 e3"
    ],
    [
      "A58a",
      "Benko Gambit: 5.bxa6",
      "d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6"
    ],
    [
      "A58b",
      "Benko Gambit: 5.bxa6 g6",
      "d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6"
    ],
    [
      "A60a",
      "Benoni: 3.d5 e6",
      "d4 Nf6 c4 c5 d5 e6"
    ],
    [
      "A60b",
      "Benoni: 4.Nf3",
      "d4 Nf6 c4 c5 d5 e6 Nf3"
    ],
    [
      "A60c",
      "Benoni: 4.Nf3 exd5 5.cxd5",
      "d4 Nf6 c4 c5 d5 e6 Nf3 exd5 cxd5"
    ],
    [
      "A60e",
      "Benoni: 4.g3",
      "d4 Nf6 c4 c5 d5 e6 g3"
    ],
    [
      "A60g",
      "Benoni: 4.Nc3",
      "d4 Nf6 c4 c5 d5 e6 Nc3"
    ],
    [
      "A60h",
      "Benoni: 4.Nc3 exd5 5.Nxd5",
      "d4 Nf6 c4 c5 d5 e6 Nc3 exd5 Nxd5"
    ],
    [
      "A60i",
      "Benoni: 4.Nc3 exd5 5.cxd5",
      "d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5"
    ],
    [
      "A65a",
      "Benoni: 6.e4",
      "d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4"
    ],
    [
      "A80a",
      "Dutch",
      "d4 f5"
    ],
    [
      "A80b",
      "Dutch: Krejcik Gambit",
      "d4 f5 g4"
    ],
    [
      "A80b",
      "Dutch: Krejcik Gambit Accepted",
      "d4 f5 g4 fxg4"
    ],
    [
      "A80c",
      "Dutch: Korchnoi Attack",
      "d4 f5 h3"
    ],
    [
      "A80c",
      "Dutch: Korchnoi, Janzen Gambit",
      "d4 f5 h3 Nf6 g4"
    ],
    [
      "A80d",
      "Dutch: 2.Bg5",
      "d4 f5 Bg5"
    ],
    [
      "A80d",
      "Dutch: 2.Bg5 d5",
      "d4 f5 Bg5 d5"
    ],
    [
      "A80d",
      "Dutch: 2.Bg5 c6",
      "d4 f5 Bg5 c6"
    ],
    [
      "A80e",
      "Dutch: 2.Bg5 Nf6",
      "d4 f5 Bg5 Nf6"
    ],
    [
      "A80f",
      "Dutch: 2.Bg5 h6",
      "d4 f5 Bg5 h6"
    ],
    [
      "A80g",
      "Dutch: 2.Bg5 g6",
      "d4 f5 Bg5 g6"
    ],
    [
      "A80h",
      "Dutch: 2.Bg5 g6 3.Nc3",
      "d4 f5 Bg5 g6 Nc3"
    ],
    [
      "A80i",
      "Dutch: Alapin",
      "d4 f5 Qd3"
    ],
    [
      "A80i",
      "Dutch: Alapin, Manhattan Gambit",
      "d4 f5 Qd3 d6 g4"
    ],
    [
      "A80i",
      "Dutch: Von Pretzel Gambit",
      "d4 f5 Qd3 e6 g4"
    ],
    [
      "A80j",
      "Dutch: 2.Nc3",
      "d4 f5 Nc3"
    ],
    [
      "A80k",
      "Dutch: 2.Nc3 d5",
      "d4 f5 Nc3 d5"
    ],
    [
      "A80k",
      "Dutch: 2.Nc3 d5, Euwe Gambit",
      "d4 f5 Nc3 d5 e4"
    ],
    [
      "A80l",
      "Dutch: 2.Nc3 d5 3.Bg5",
      "d4 f5 Nc3 d5 Bg5"
    ],
    [
      "A80m",
      "Dutch: 2.Nc3 Nf6",
      "d4 f5 Nc3 Nf6"
    ],
    [
      "A80m",
      "Dutch: Spielmann Gambit",
      "d4 f5 Nc3 Nf6 g4"
    ],
    [
      "A80n",
      "Dutch: 2.Nc3 Nf6 3.Bg5",
      "d4 f5 Nc3 Nf6 Bg5"
    ],
    [
      "A80n",
      "Dutch: 2.Nc3 Nf6 3.Bg5 e6",
      "d4 f5 Nc3 Nf6 Bg5 e6"
    ],
    [
      "A80o",
      "Dutch: 2.Nc3 Nf6 3.Bg5 d5",
      "d4 f5 Nc3 Nf6 Bg5 d5"
    ],
    [
      "A80q",
      "Dutch: 2.Nf3",
      "d4 f5 Nf3"
    ],
    [
      "A80r",
      "Dutch: 2.Nf3 e6",
      "d4 f5 Nf3 e6"
    ],
    [
      "A80s",
      "Dutch: 2.Nf3 e6 3.d5",
      "d4 f5 Nf3 e6 d5"
    ],
    [
      "A80t",
      "Dutch: 2.Nf3 Nf6",
      "d4 f5 Nf3 Nf6"
    ],
    [
      "A80u",
      "Dutch: Barcza System",
      "d4 f5 Nf3 Nf6 c3"
    ],
    [
      "A80v",
      "Dutch: 2.Nf3 Nf6 3.Bg5",
      "d4 f5 Nf3 Nf6 Bg5"
    ],
    [
      "A81",
      "Dutch: 2.g3",
      "d4 f5 g3"
    ],
    [
      "A81",
      "Dutch: 2.g3 e6",
      "d4 f5 g3 e6"
    ],
    [
      "A81",
      "Dutch: 2.g3 e6 3.Nf3",
      "d4 f5 g3 e6 Nf3"
    ],
    [
      "A81",
      "Dutch: 2.g3 e6 3.Nf3 Nf6",
      "d4 f5 g3 e6 Nf3 Nf6"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6",
      "d4 f5 g3 Nf6"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6 3.Nf3",
      "d4 f5 g3 Nf6 Nf3"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6 3.Bg2",
      "d4 f5 g3 Nf6 Bg2"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6 3.Bg2 e6",
      "d4 f5 g3 Nf6 Bg2 e6"
    ],
    [
      "A81",
      "Dutch: Blackburne Variation",
      "d4 f5 g3 Nf6 Bg2 e6 Nh3"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6 3.Bg2 g6",
      "d4 f5 g3 Nf6 Bg2 g6"
    ],
    [
      "A81",
      "Dutch: 2.g3 Nf6 3.Bg2 g6 4.Nf3",
      "d4 f5 g3 Nf6 Bg2 g6 Nf3"
    ],
    [
      "A81",
      "Dutch: Leningrad, Carlsbad Variation",
      "d4 f5 g3 g6 Bg2 Bg7 Nh3"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit",
      "d4 f5 e4"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, Balogh Defence",
      "d4 f5 e4 d6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit Accepted",
      "d4 f5 e4 fxe4"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 3.Nc3",
      "d4 f5 e4 fxe4 Nc3"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 3.Nc3 e6",
      "d4 f5 e4 fxe4 Nc3 e6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 3.Nc3 g6",
      "d4 f5 e4 fxe4 Nc3 g6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 3.Nc3 Nf6",
      "d4 f5 e4 fxe4 Nc3 Nf6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 4.f3",
      "d4 f5 e4 fxe4 Nc3 Nf6 f3"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 4.f3 e6",
      "d4 f5 e4 fxe4 Nc3 Nf6 f3 e6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 4.f3 Nc6",
      "d4 f5 e4 fxe4 Nc3 Nf6 f3 Nc6"
    ],
    [
      "A82",
      "Dutch: Staunton Gambit, 4.f3 d5",
      "d4 f5 e4 fxe4 Nc3 Nf6 f3 d5"
    ],
    [
      "A84",
      "Dutch: 2.c4",
      "d4 f5 c4"
    ],
    [
      "A84",
      "Dutch: 2.c4 d6",
      "d4 f5 c4 d6"
    ],
    [
      "A84",
      "Dutch: 2.c4 g6",
      "d4 f5 c4 g6"
    ],
    [
      "A84",
      "Dutch: Bladel Variation",
      "d4 f5 c4 g6 Nc3 Nh6"
    ],
    [
      "A84",
      "Dutch: 2.c4 e6",
      "d4 f5 c4 e6"
    ],
    [
      "A84",
      "Dutch: 2.c4 e6 3.Nf3",
      "d4 f5 c4 e6 Nf3"
    ],
    [
      "A84",
      "Dutch: 2.c4 e6 3.Nf3 Nf6",
      "d4 f5 c4 e6 Nf3 Nf6"
    ],
    [
      "A84",
      "Dutch: Rubinstein Variation",
      "d4 f5 c4 e6 Nc3"
    ],
    [
      "A84",
      "Dutch: Rubinstein, 3...d5",
      "d4 f5 c4 e6 Nc3 d5"
    ],
    [
      "A84",
      "Dutch: Rubinstein, 3...d5 4.e3 c6",
      "d4 f5 c4 e6 Nc3 d5 e3 c6"
    ],
    [
      "A84",
      "Dutch: Staunton Gambit Deferred",
      "d4 f5 c4 e6 e4"
    ],
    [
      "A84",
      "Dutch: 2.c4 Nf6",
      "d4 f5 c4 Nf6"
    ],
    [
      "A84",
      "Dutch: 2.c4 Nf6",
      "d4 f5 c4 Nf6 Nf3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3",
      "d4 f5 c4 Nf6 Nc3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 d6",
      "d4 f5 c4 Nf6 Nc3 d6"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6",
      "d4 f5 c4 Nf6 Nc3 e6"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.a3",
      "d4 f5 c4 Nf6 Nc3 e6 a3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.Qc2",
      "d4 f5 c4 Nf6 Nc3 e6 Qc2"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.Bg5",
      "d4 f5 c4 Nf6 Nc3 e6 Bg5"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.e3",
      "d4 f5 c4 Nf6 Nc3 e6 e3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.e3 d5",
      "d4 f5 c4 Nf6 Nc3 e6 e3 d5"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.e3 Bb4",
      "d4 f5 c4 Nf6 Nc3 e6 e3 Bb4"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 e6 4.Nf3",
      "d4 f5 c4 Nf6 Nc3 e6 Nf3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 g6",
      "d4 f5 c4 Nf6 Nc3 g6"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 g6 4.f3",
      "d4 f5 c4 Nf6 Nc3 g6 f3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 g6 4.Bg5",
      "d4 f5 c4 Nf6 Nc3 g6 Bg5"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 g6 4.Nf3",
      "d4 f5 c4 Nf6 Nc3 g6 Nf3"
    ],
    [
      "A85",
      "Dutch: 2.c4 Nf6 3.Nc3 g6 4.Nf3 Bg7",
      "d4 f5 c4 Nf6 Nc3 g6 Nf3 Bg7"
    ],
    [
      "A86",
      "Dutch: 2.c4 Nf6 3.g3",
      "d4 f5 c4 Nf6 g3"
    ],
    [
      "A86",
      "Dutch: 2.c4 Nf6 3.g3 d6",
      "d4 f5 c4 Nf6 g3 d6"
    ],
    [
      "A86",
      "Dutch: Leningrad Variation",
      "d4 f5 c4 Nf6 g3 g6"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Nc3",
      "d4 f5 c4 Nf6 g3 g6 Nc3"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Nc3 Bg7",
      "d4 f5 c4 Nf6 g3 g6 Nc3 Bg7"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Nf3",
      "d4 f5 c4 Nf6 g3 g6 Nf3"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Nf3 Bg7",
      "d4 f5 c4 Nf6 g3 g6 Nf3 Bg7"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Bg2",
      "d4 f5 c4 Nf6 g3 g6 Bg2"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Bg2 d6",
      "d4 f5 c4 Nf6 g3 g6 Bg2 d6"
    ],
    [
      "A86",
      "Dutch: Leningrad, 4.Bg2 Bg7",
      "d4 f5 c4 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "A87",
      "Dutch: Leningrad, Main Line",
      "d4 f5 c4 Nf6 g3 g6 Bg2 Bg7 Nf3"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6",
      "d4 f5 c4 Nf6 g3 e6"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Nc3",
      "d4 f5 c4 Nf6 g3 e6 Nc3"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Nc3 d5",
      "d4 f5 c4 Nf6 g3 e6 Nc3 d5"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Nf3",
      "d4 f5 c4 Nf6 g3 e6 Nf3"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Nf3 d5",
      "d4 f5 c4 Nf6 g3 e6 Nf3 d5"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Bg2",
      "d4 f5 c4 Nf6 g3 e6 Bg2"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Bg2 d5",
      "d4 f5 c4 Nf6 g3 e6 Bg2 d5"
    ],
    [
      "A90",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Bg2 c6",
      "d4 f5 c4 Nf6 g3 e6 Bg2 c6"
    ],
    [
      "A91",
      "Dutch: 2.c4 Nf6 3.g3 e6 4.Bg2 Be7",
      "d4 f5 c4 Nf6 g3 e6 Bg2 Be7"
    ],
    [
      "B00a",
      "King's Pawn",
      "e4"
    ],
    [
      "B00a",
      "King's Pawn: Hippopotamus Defence",
      "e4 Nh6 d4 g6 c4 f6"
    ],
    [
      "B00a",
      "King's Pawn: Fred",
      "e4 f5"
    ],
    [
      "B00b",
      "Reversed Grob (Borg/Basman Defence)",
      "e4 g5"
    ],
    [
      "B00b",
      "Reversed Grob (Borg/Basman Defence)",
      "e4 g5 d4"
    ],
    [
      "B00c",
      "St. George Defence",
      "e4 a6"
    ],
    [
      "B00c",
      "St. George Defence",
      "e4 a6 d4"
    ],
    [
      "B00c",
      "Basman's Creepy-Crawly System (as Black)",
      "e4 a6 d4 h6"
    ],
    [
      "B00d",
      "Owen Defence",
      "e4 b6"
    ],
    [
      "B00d",
      "Owen Defence",
      "e4 b6 d4"
    ],
    [
      "B00e",
      "Owen Defence: French",
      "e4 b6 d4 e6"
    ],
    [
      "B00f",
      "Owen Defence: 2.d4 Bb7",
      "e4 b6 d4 Bb7"
    ],
    [
      "B00f",
      "Owen Defence: Naselwaus Gambit",
      "e4 b6 d4 Bb7 Bg5"
    ],
    [
      "B00f",
      "Owen Defence: Smith Gambit",
      "e4 b6 d4 Bb7 Nf3"
    ],
    [
      "B00g",
      "Owen Defence: 3.Bd3",
      "e4 b6 d4 Bb7 Bd3"
    ],
    [
      "B00g",
      "Owen Defence: Matinovsky Gambit",
      "e4 b6 d4 Bb7 Bd3 f5"
    ],
    [
      "B00h",
      "Owen Defence: 3.Bd3 Nf6",
      "e4 b6 d4 Bb7 Bd3 Nf6"
    ],
    [
      "B00i",
      "Owen Defence: 3.Bd3 e6",
      "e4 b6 d4 Bb7 Bd3 e6"
    ],
    [
      "B00j",
      "Owen Defence: 3.Bd3 e6 4.Nf3",
      "e4 b6 d4 Bb7 Bd3 e6 Nf3"
    ],
    [
      "B00k",
      "Owen Defence: 3.Bd3 e6 4.Nf3 c5",
      "e4 b6 d4 Bb7 Bd3 e6 Nf3 c5"
    ],
    [
      "B00l",
      "Nimzowitsch Defence",
      "e4 Nc6"
    ],
    [
      "B00l",
      "Nimzowitsch Defence: Wheeler Gambit",
      "e4 Nc6 b4"
    ],
    [
      "B00m",
      "Nimzowitsch Defence: 2.Nc3",
      "e4 Nc6 Nc3"
    ],
    [
      "B00m",
      "Nimzowitsch Defence: 2.Nc3 Nf6",
      "e4 Nc6 Nc3 Nf6"
    ],
    [
      "B00m",
      "Nimzowitsch Defence: 2.Nc3 e6",
      "e4 Nc6 Nc3 e6"
    ],
    [
      "B00n",
      "Nimzowitsch Defence: 2.Nf3",
      "e4 Nc6 Nf3"
    ],
    [
      "B00n",
      "Nimzowitsch Defence: Colorado Counter",
      "e4 Nc6 Nf3 f5"
    ],
    [
      "B00o",
      "Nimzowitsch Defence: 2.Nf3 d6",
      "e4 Nc6 Nf3 d6"
    ],
    [
      "B00o",
      "Nimzowitsch Defence: 2.Nf3 d6 3.d4",
      "e4 Nc6 Nf3 d6 d4"
    ],
    [
      "B00o",
      "Nimzowitsch Defence: 2.Nf3 d6 3.d4 Bg4",
      "e4 Nc6 Nf3 d6 d4 Bg4"
    ],
    [
      "B00p",
      "Nimzowitsch Defence: 2.Nf3 d6 3.d4 Nf6",
      "e4 Nc6 Nf3 d6 d4 Nf6"
    ],
    [
      "B00t",
      "Nimzowitsch Defence: 2.d4",
      "e4 Nc6 d4"
    ],
    [
      "B00t",
      "Nimzowitsch Defence: 2.d4 d6",
      "e4 Nc6 d4 d6"
    ],
    [
      "B00t",
      "Nimzowitsch Defence: 2.d4 d6 3.Nc3",
      "e4 Nc6 d4 d6 Nc3"
    ],
    [
      "B00u",
      "Nimzowitsch Defence: 2.d4 e5",
      "e4 Nc6 d4 e5"
    ],
    [
      "B00u",
      "Nimzowitsch Defence: 2.d4 e5 3.dxe5",
      "e4 Nc6 d4 e5 dxe5"
    ],
    [
      "B00u",
      "Nimzowitsch Defence: 2.d4 e5 3.d5",
      "e4 Nc6 d4 e5 d5"
    ],
    [
      "B00v",
      "Nimzowitsch Defence: 2.d4 d5",
      "e4 Nc6 d4 d5"
    ],
    [
      "B00v",
      "Nimzowitsch Defence: 2.d4 d5 3.exd5",
      "e4 Nc6 d4 d5 exd5"
    ],
    [
      "B00v",
      "Nimzowitsch Defence: Aachen Gambit",
      "e4 Nc6 d4 d5 exd5 Nb4"
    ],
    [
      "B00v",
      "Nimzowitsch Defence: 2.d4 d5 3.exd5 Qxd5",
      "e4 Nc6 d4 d5 exd5 Qxd5"
    ],
    [
      "B00w",
      "Nimzowitsch Defence: Bogoljubow Variation",
      "e4 Nc6 d4 d5 Nc3"
    ],
    [
      "B00w",
      "Nimzowitsch Defence: Bogoljubow, 3...e5",
      "e4 Nc6 d4 d5 Nc3 e5"
    ],
    [
      "B00w",
      "Nimzowitsch Defence: Bogoljubow, 3...Nf6",
      "e4 Nc6 d4 d5 Nc3 Nf6"
    ],
    [
      "B00w",
      "Nimzowitsch Defence: Bogoljubow, 3...dxe4",
      "e4 Nc6 d4 d5 Nc3 dxe4"
    ],
    [
      "B00x",
      "Nimzowitsch Defence: 2.d4 d5 3.e5",
      "e4 Nc6 d4 d5 e5"
    ],
    [
      "B00x",
      "Nimzowitsch Defence: 2.d4 d5 3.e5 Bf5",
      "e4 Nc6 d4 d5 e5 Bf5"
    ],
    [
      "B01a",
      "Scandinavian (Centre Counter)",
      "e4 d5"
    ],
    [
      "B01a",
      "Scandinavian: 2.d3",
      "e4 d5 d3"
    ],
    [
      "B01a",
      "Scandinavian: 2.e5",
      "e4 d5 e5"
    ],
    [
      "B01a",
      "Scandinavian: 2.exd5",
      "e4 d5 exd5"
    ],
    [
      "B01a",
      "Scandinavian: B\u00f6hnke Gambit",
      "e4 d5 exd5 e5"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5",
      "e4 d5 exd5 Qxd5"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.Nf3",
      "e4 d5 exd5 Qxd5 Nf3"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.Nf3 Nf6",
      "e4 d5 exd5 Qxd5 Nf3 Nf6"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.d4",
      "e4 d5 exd5 Qxd5 d4"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.d4 Nf6",
      "e4 d5 exd5 Qxd5 d4 Nf6"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.d4 e5",
      "e4 d5 exd5 Qxd5 d4 e5"
    ],
    [
      "B01b",
      "Scandinavian: 2...Qxd5 3.Nc3",
      "e4 d5 exd5 Qxd5 Nc3"
    ],
    [
      "B01c",
      "Scandinavian: 2...Qxd5 3.Nc3 Qd8",
      "e4 d5 exd5 Qxd5 Nc3 Qd8"
    ],
    [
      "B01d",
      "Scandinavian: Schiller Defence",
      "e4 d5 exd5 Qxd5 Nc3 Qd6"
    ],
    [
      "B01e",
      "Scandinavian, Mieses Gambit",
      "e4 d5 exd5 Qxd5 Nc3 Qa5 b4"
    ],
    [
      "B01r",
      "Scandinavian: 2...Nf6",
      "e4 d5 exd5 Nf6"
    ],
    [
      "B01r",
      "Scandinavian: 2...Nf6 3.Bc4",
      "e4 d5 exd5 Nf6 Bc4"
    ],
    [
      "B01r",
      "Scandinavian: 2...Nf6 3.Nf3",
      "e4 d5 exd5 Nf6 Nf3"
    ],
    [
      "B01r",
      "Scandinavian: 2...Nf6 3.Nf3 Nxd5",
      "e4 d5 exd5 Nf6 Nf3 Nxd5"
    ],
    [
      "B01s",
      "Scandinavian: 2...Nf6 3.Bb5+",
      "e4 d5 exd5 Nf6 Bb5+"
    ],
    [
      "B01s",
      "Scandinavian: 2...Nf6 3.Bb5+ Nbd7",
      "e4 d5 exd5 Nf6 Bb5+ Nbd7"
    ],
    [
      "B01s",
      "Scandinavian: 2...Nf6 3.Bb5+ Bd7",
      "e4 d5 exd5 Nf6 Bb5+ Bd7"
    ],
    [
      "B01t",
      "Scandinavian: 2...Nf6 3.c4",
      "e4 d5 exd5 Nf6 c4"
    ],
    [
      "B01t",
      "Scandinavian: Scandinavian Gambit",
      "e4 d5 exd5 Nf6 c4 c6"
    ],
    [
      "B01t",
      "Scandinavian: Icelandic Gambit",
      "e4 d5 exd5 Nf6 c4 e6"
    ],
    [
      "B01u",
      "Scandinavian: 2...Nf6 3.d4",
      "e4 d5 exd5 Nf6 d4"
    ],
    [
      "B01u",
      "Scandinavian: Richter Variation",
      "e4 d5 exd5 Nf6 d4 g6"
    ],
    [
      "B01u",
      "Scandinavian: Portuguese Variation",
      "e4 d5 exd5 Nf6 d4 Bg4"
    ],
    [
      "B01u",
      "Scandinavian: Portuguese, 4.Bb5+",
      "e4 d5 exd5 Nf6 d4 Bg4 Bb5+"
    ],
    [
      "B01u",
      "Scandinavian: Portuguese, 4.Nf3",
      "e4 d5 exd5 Nf6 d4 Bg4 Nf3"
    ],
    [
      "B01u",
      "Scandinavian: Portuguese, 4.Be2",
      "e4 d5 exd5 Nf6 d4 Bg4 Be2"
    ],
    [
      "B01v",
      "Scandinavian: Portuguese, 4.f3",
      "e4 d5 exd5 Nf6 d4 Bg4 f3"
    ],
    [
      "B01w",
      "Scandinavian: Marshall Variation",
      "e4 d5 exd5 Nf6 d4 Nxd5"
    ],
    [
      "B01w",
      "Scandinavian: Marshall, 4.Nf3",
      "e4 d5 exd5 Nf6 d4 Nxd5 Nf3"
    ],
    [
      "B01y",
      "Scandinavian: Marshall, 4.c4",
      "e4 d5 exd5 Nf6 d4 Nxd5 c4"
    ],
    [
      "B02a",
      "Alekhine Defence",
      "e4 Nf6"
    ],
    [
      "B02a",
      "Alekhine: Krejcik Variation",
      "e4 Nf6 Bc4"
    ],
    [
      "B02b",
      "Alekhine: Maroczy Variation",
      "e4 Nf6 d3"
    ],
    [
      "B02c",
      "Alekhine: Scandinavian Variation",
      "e4 Nf6 Nc3"
    ],
    [
      "B02c",
      "Alekhine: Scandinavian Variation",
      "e4 Nf6 Nc3 d5"
    ],
    [
      "B02d",
      "Alekhine: Scandinavian, 3.e5",
      "e4 Nf6 Nc3 d5 e5"
    ],
    [
      "B02e",
      "Alekhine: Scandinavian, 3.e5 Ne4",
      "e4 Nf6 Nc3 d5 e5 Ne4"
    ],
    [
      "B02f",
      "Alekhine: Scandinavian, 3.e5 Nfd7",
      "e4 Nf6 Nc3 d5 e5 Nfd7"
    ],
    [
      "B02f",
      "Alekhine: Spielmann Gambit",
      "e4 Nf6 Nc3 d5 e5 Nfd7 e6"
    ],
    [
      "B02g",
      "Alekhine: Scandinavian, Exchange",
      "e4 Nf6 Nc3 d5 exd5"
    ],
    [
      "B02g",
      "Alekhine: Scandinavian, Geschev Gambit",
      "e4 Nf6 Nc3 d5 exd5 c6"
    ],
    [
      "B02g",
      "Alekhine: Scandinavian, Exchange",
      "e4 Nf6 Nc3 d5 exd5 Nxd5"
    ],
    [
      "B02l",
      "Alekhine: 2.e5",
      "e4 Nf6 e5"
    ],
    [
      "B02l",
      "Alekhine: Mokele Mbembe (B\u00fccker) Variation",
      "e4 Nf6 e5 Ne4"
    ],
    [
      "B02l",
      "Alekhine: Brooklyn Defence (Retreat Variation)",
      "e4 Nf6 e5 Ng8"
    ],
    [
      "B02m",
      "Alekhine: 2.e5 Nd5",
      "e4 Nf6 e5 Nd5"
    ],
    [
      "B02m",
      "Alekhine: Welling Variation",
      "e4 Nf6 e5 Nd5 b3"
    ],
    [
      "B02n",
      "Alekhine: 3.Bc4",
      "e4 Nf6 e5 Nd5 Bc4"
    ],
    [
      "B02n",
      "Alekhine: Kmoch Variation",
      "e4 Nf6 e5 Nd5 Bc4 Nb6 Bb3 c5 d3"
    ],
    [
      "B02o",
      "Alekhine: S\u00e4misch Attack",
      "e4 Nf6 e5 Nd5 Nc3"
    ],
    [
      "B02p",
      "Alekhine: S\u00e4misch Attack, 3...Nxc3",
      "e4 Nf6 e5 Nd5 Nc3 Nxc3"
    ],
    [
      "B02r",
      "Alekhine: Chase Variation",
      "e4 Nf6 e5 Nd5 c4"
    ],
    [
      "B02r",
      "Alekhine: Chase Variation",
      "e4 Nf6 e5 Nd5 c4 Nb6"
    ],
    [
      "B02r",
      "Alekhine: Chase, Steiner Variation",
      "e4 Nf6 e5 Nd5 c4 Nb6 b3"
    ],
    [
      "B02s",
      "Alekhine: Two Pawns (Lasker) Attack",
      "e4 Nf6 e5 Nd5 c4 Nb6 c5"
    ],
    [
      "B03a",
      "Alekhine: 3.d4",
      "e4 Nf6 e5 Nd5 d4"
    ],
    [
      "B03a",
      "Alekhine: O'Sullivan Gambit",
      "e4 Nf6 e5 Nd5 d4 b5"
    ],
    [
      "B03b",
      "Alekhine: 3.d4 d6",
      "e4 Nf6 e5 Nd5 d4 d6"
    ],
    [
      "B03c",
      "Alekhine: 3.d4 d6 4.exd6",
      "e4 Nf6 e5 Nd5 d4 d6 exd6"
    ],
    [
      "B03d",
      "Alekhine: Balogh Variation",
      "e4 Nf6 e5 Nd5 d4 d6 Bc4"
    ],
    [
      "B03e",
      "Alekhine: 4.c4",
      "e4 Nf6 e5 Nd5 d4 d6 c4"
    ],
    [
      "B03e",
      "Alekhine: 4.c4 Nb6",
      "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6"
    ],
    [
      "B03f",
      "Alekhine: 4.c4 Nb6 5.Nf3",
      "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 Nf3"
    ],
    [
      "B03g",
      "Alekhine: Four Pawns Attack",
      "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4"
    ],
    [
      "B04a",
      "Alekhine: Modern Variation",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3"
    ],
    [
      "B04b",
      "Alekhine: Modern, 4...Nc6",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3 Nc6"
    ],
    [
      "B04c",
      "Alekhine: Modern, 4...c6",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3 c6"
    ],
    [
      "B04d",
      "Alekhine: Modern, 4...c6 5.c4",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3 c6 c4"
    ],
    [
      "B05a",
      "Alekhine: Modern, 4...Bg4",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4"
    ],
    [
      "B05f",
      "Alekhine: Modern, 5.Be2",
      "e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 Be2"
    ],
    [
      "B06a",
      "Modern",
      "e4 g6"
    ],
    [
      "B06b",
      "Modern",
      "e4 g6 Nc3"
    ],
    [
      "B06b",
      "Modern",
      "e4 g6 Nc3 d6"
    ],
    [
      "B06b",
      "Modern",
      "e4 g6 Nc3 Bg7"
    ],
    [
      "B06c",
      "Modern",
      "e4 g6 Nc3 Bg7 f4 d6"
    ],
    [
      "B06c",
      "Modern",
      "e4 g6 f4"
    ],
    [
      "B06c",
      "Modern",
      "e4 g6 f4 d6"
    ],
    [
      "B06c",
      "Modern",
      "e4 g6 f4 Bg7 Nf3"
    ],
    [
      "B06c",
      "Modern",
      "e4 g6 f4 Bg7 Nf3 d6"
    ],
    [
      "B06d",
      "Modern",
      "e4 g6 d4"
    ],
    [
      "B06d",
      "Modern: Norwegian Defence",
      "e4 g6 d4 Nf6"
    ],
    [
      "B06d",
      "Modern: Norwegian Defence",
      "e4 g6 d4 Nf6 e5 Nh5 g4 Ng7"
    ],
    [
      "B06d",
      "Modern",
      "e4 g6 d4 c6"
    ],
    [
      "B06e",
      "Modern",
      "e4 g6 d4 d6"
    ],
    [
      "B06f",
      "Modern",
      "e4 g6 d4 Bg7"
    ],
    [
      "B06f",
      "Modern: 3.Bc4",
      "e4 g6 d4 Bg7 Bc4"
    ],
    [
      "B06g",
      "Modern: 3.c3",
      "e4 g6 d4 Bg7 c3"
    ],
    [
      "B06g",
      "Modern: 3.c3",
      "e4 g6 d4 Bg7 c3 d6"
    ],
    [
      "B06g",
      "Modern: c3 Pterodactyl",
      "e4 g6 d4 Bg7 c3 d6 f4 c5"
    ],
    [
      "B06h",
      "Modern: Geller System",
      "e4 g6 d4 Bg7 c3 d6 Nf3"
    ],
    [
      "B06i",
      "Modern: 3.Nf3",
      "e4 g6 d4 Bg7 Nf3"
    ],
    [
      "B06j",
      "Modern: 3.Nf3 d6",
      "e4 g6 d4 Bg7 Nf3 d6"
    ],
    [
      "B06k",
      "Modern: 3.Nf3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nf3 d6 Bc4"
    ],
    [
      "B06l",
      "Modern: 3.Nc3",
      "e4 g6 d4 Bg7 Nc3"
    ],
    [
      "B06l",
      "Modern: Mittenberger Gambit",
      "e4 g6 d4 Bg7 Nc3 d5"
    ],
    [
      "B06l",
      "Modern: Nc3 Pterodactyl",
      "e4 g6 d4 Bg7 Nc3 c5"
    ],
    [
      "B06m",
      "Modern: 3.Nc3",
      "e4 g6 d4 Bg7 Nc3 d6"
    ],
    [
      "B06n",
      "Modern: 3.Nc3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nc3 d6 Bc4"
    ],
    [
      "B06n",
      "Modern: 3.Nc3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nc3 d6 Bc4 c6"
    ],
    [
      "B06n",
      "Modern: 3.Nc3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nc3 d6 Bc4 c6 Qf3"
    ],
    [
      "B06n",
      "Modern: 3.Nc3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nc3 d6 Bc4 c6 Qf3 Nf6"
    ],
    [
      "B06n",
      "Modern: 3.Nc3 d6 4.Bc4",
      "e4 g6 d4 Bg7 Nc3 d6 Bc4 c6 Qf3 e6"
    ],
    [
      "B06o",
      "Modern: 3.Nc3 d6 4.Be3",
      "e4 g6 d4 Bg7 Nc3 d6 Be3"
    ],
    [
      "B06p",
      "Modern: 3.Nc3 d6 4.Be3 a6",
      "e4 g6 d4 Bg7 Nc3 d6 Be3 a6"
    ],
    [
      "B06q",
      "Modern: 3.Nc3 d6 4.Be3 c6",
      "e4 g6 d4 Bg7 Nc3 d6 Be3 c6"
    ],
    [
      "B06r",
      "Modern: Two Knights Variation",
      "e4 g6 d4 Bg7 Nc3 d6 Nf3"
    ],
    [
      "B06s",
      "Modern: Pseudo-Austrian Attack",
      "e4 g6 d4 Bg7 Nc3 d6 f4"
    ],
    [
      "B06s",
      "Modern: Pseudo-Austrian Attack",
      "e4 g6 d4 Bg7 Nc3 d6 f4 c6"
    ],
    [
      "B06t",
      "Modern: Pseudo-Austrian Attack",
      "e4 g6 d4 Bg7 Nc3 d6 f4 Nc6"
    ],
    [
      "B06u",
      "Modern: Three Pawns Attack",
      "e4 g6 d4 Bg7 f4"
    ],
    [
      "B07a",
      "Pirc",
      "e4 d6"
    ],
    [
      "B07a",
      "Pirc",
      "e4 d6 g3"
    ],
    [
      "B07a",
      "Pirc",
      "e4 d6 c4"
    ],
    [
      "B07a",
      "Pirc: 2.Nc3",
      "e4 d6 Nc3"
    ],
    [
      "B07a",
      "Pirc: 2.Nc3",
      "e4 d6 Nc3 Nf6"
    ],
    [
      "B07b",
      "Pirc: 2.Nf3",
      "e4 d6 Nf3"
    ],
    [
      "B07b",
      "Pirc/Reti: Wade Defence",
      "e4 d6 Nf3 Bg4"
    ],
    [
      "B07b",
      "Pirc: 2.Nf3 Nf6",
      "e4 d6 Nf3 Nf6"
    ],
    [
      "B07b",
      "Pirc: 2.Nf3 Nf6 3.Nc3",
      "e4 d6 Nf3 Nf6 Nc3"
    ],
    [
      "B07c",
      "Pirc: 2.f4",
      "e4 d6 f4"
    ],
    [
      "B07c",
      "Pirc: 2.f4 Nf6",
      "e4 d6 f4 Nf6"
    ],
    [
      "B07c",
      "Pirc: 2.f4 Nf6 3.Nc3",
      "e4 d6 f4 Nf6 Nc3"
    ],
    [
      "B07c",
      "Pirc: 2.f4 Nf6 3.Nc3 g6 4.Nf3 Bg7",
      "e4 d6 f4 Nf6 Nc3 g6 Nf3 Bg7"
    ],
    [
      "B07d",
      "Pirc: 2.d4",
      "e4 d6 d4"
    ],
    [
      "B07d",
      "Pirc: 2.d4 c6",
      "e4 d6 d4 c6"
    ],
    [
      "B07d",
      "Pirc: Lengfellner System",
      "e4 d6 d4 e6"
    ],
    [
      "B07d",
      "Pirc: 2.d4 Nd7",
      "e4 d6 d4 Nd7"
    ],
    [
      "B07d",
      "Pirc: 2.d4 Nf6",
      "e4 d6 d4 Nf6"
    ],
    [
      "B07d",
      "Pirc: Roscher Gambit",
      "e4 d6 d4 Nf6 Nf3"
    ],
    [
      "B07d",
      "Pirc: 3.Nbd2",
      "e4 d6 d4 Nf6 Nbd2"
    ],
    [
      "B07d",
      "Pirc: 3.Nbd2 g6",
      "e4 d6 d4 Nf6 Nbd2 g6"
    ],
    [
      "B07d",
      "Pirc: 3.Nbd2 g6",
      "e4 d6 d4 Nf6 Nbd2 g6 c3 Bg7"
    ],
    [
      "B07e",
      "Pirc: 3.f3",
      "e4 d6 d4 Nf6 f3"
    ],
    [
      "B07f",
      "Pirc: 3.f3 e5",
      "e4 d6 d4 Nf6 f3 e5"
    ],
    [
      "B07f",
      "Pirc: 3.f3 e5 Queenswap",
      "e4 d6 d4 Nf6 f3 e5 dxe5 dxe5 Qxd8+"
    ],
    [
      "B07f",
      "Pirc: 3.f3 e5 4.d5",
      "e4 d6 d4 Nf6 f3 e5 d5"
    ],
    [
      "B07g",
      "Pirc: 3.f3 g6",
      "e4 d6 d4 Nf6 f3 g6"
    ],
    [
      "B07h",
      "Pirc: 3.Bd3",
      "e4 d6 d4 Nf6 Bd3"
    ],
    [
      "B07h",
      "Pirc: 3.Bd3 e5",
      "e4 d6 d4 Nf6 Bd3 e5"
    ],
    [
      "B07h",
      "Pirc: 3.Bd3 e5 4.c3 d5",
      "e4 d6 d4 Nf6 Bd3 e5 c3 d5"
    ],
    [
      "B07h",
      "Pirc: 3.Bd3 e5 4.c3 d5",
      "e4 d6 d4 Nf6 Bd3 e5 c3 d5 dxe5 dxe4"
    ],
    [
      "B07h",
      "Pirc: 3.Bd3 e5 4.c3 d5",
      "e4 d6 d4 Nf6 Bd3 e5 c3 d5 dxe5 Nxe4"
    ],
    [
      "B07i",
      "Pirc: 3.Bd3 g6",
      "e4 d6 d4 Nf6 Bd3 g6"
    ],
    [
      "B07i",
      "Pirc: 3.Bd3 g6",
      "e4 d6 d4 Nf6 Bd3 g6 Nf3"
    ],
    [
      "B07i",
      "Pirc: 3.Bd3 g6",
      "e4 d6 d4 Nf6 Bd3 g6 Nf3 Bg7"
    ],
    [
      "B07k",
      "Pirc: 3.Nc3",
      "e4 d6 d4 Nf6 Nc3"
    ],
    [
      "B07l",
      "Pirc: 3.Nc3 Nbd7",
      "e4 d6 d4 Nf6 Nc3 Nbd7"
    ],
    [
      "B07m",
      "Pirc: 3.Nc3 e5",
      "e4 d6 d4 Nf6 Nc3 e5"
    ],
    [
      "B07n",
      "Pirc: Pytel/Czech",
      "e4 d6 d4 Nf6 Nc3 c6"
    ],
    [
      "B07o",
      "Pirc: Czech, 4.Nf3",
      "e4 d6 d4 Nf6 Nc3 c6 Nf3"
    ],
    [
      "B07p",
      "Pirc: Czech, 4.f4",
      "e4 d6 d4 Nf6 Nc3 c6 f4"
    ],
    [
      "B07p",
      "Pirc: Czech, 4.f4 Qa5",
      "e4 d6 d4 Nf6 Nc3 c6 f4 Qa5"
    ],
    [
      "B07q",
      "Pirc: 3...g6",
      "e4 d6 d4 Nf6 Nc3 g6"
    ],
    [
      "B07q",
      "Pirc: 3...g6",
      "e4 d6 d4 Nf6 Nc3 g6 h4"
    ],
    [
      "B07q",
      "Pirc: 4.Nge2",
      "e4 d6 d4 Nf6 Nc3 g6 Nge2"
    ],
    [
      "B07q",
      "Pirc: 4.Nge2",
      "e4 d6 d4 Nf6 Nc3 g6 Nge2 Bg7"
    ],
    [
      "B07r",
      "Pirc: Sveshnikov (4.g3)",
      "e4 d6 d4 Nf6 Nc3 g6 g3"
    ],
    [
      "B07r",
      "Pirc: Sveshnikov (4.g3)",
      "e4 d6 d4 Nf6 Nc3 g6 g3 Bg7"
    ],
    [
      "B07r",
      "Pirc: Sveshnikov (4.g3)",
      "e4 d6 d4 Nf6 Nc3 g6 g3 Bg7 Bg2 c6"
    ],
    [
      "B07s",
      "Pirc: Holmov (4.Bc4)",
      "e4 d6 d4 Nf6 Nc3 g6 Bc4"
    ],
    [
      "B07s",
      "Pirc: Holmov (4.Bc4)",
      "e4 d6 d4 Nf6 Nc3 g6 Bc4 Bg7"
    ],
    [
      "B07t",
      "Pirc: 4.Be3",
      "e4 d6 d4 Nf6 Nc3 g6 Be3"
    ],
    [
      "B07t",
      "Pirc: 4.Be3 c6",
      "e4 d6 d4 Nf6 Nc3 g6 Be3 c6"
    ],
    [
      "B07u",
      "Pirc: 4.Be3 Bg7",
      "e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7"
    ],
    [
      "B07u",
      "Pirc: 4.Be3, 150 Attack",
      "e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7 Qd2"
    ],
    [
      "B07v",
      "Pirc: 4.Be3, 150 Attack",
      "e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7 Qd2 c6"
    ],
    [
      "B07w",
      "Pirc: Byrne 4.Bg5",
      "e4 d6 d4 Nf6 Nc3 g6 Bg5"
    ],
    [
      "B07x",
      "Pirc: 4.Bg5 Bg7",
      "e4 d6 d4 Nf6 Nc3 g6 Bg5 Bg7"
    ],
    [
      "B07y",
      "Pirc: 4.Be2",
      "e4 d6 d4 Nf6 Nc3 g6 Be2"
    ],
    [
      "B07y",
      "Pirc: 4.Be2",
      "e4 d6 d4 Nf6 Nc3 g6 Be2 Bg7"
    ],
    [
      "B07y",
      "Pirc: Chinese Variation",
      "e4 d6 d4 Nf6 Nc3 g6 Be2 Bg7 g4"
    ],
    [
      "B08a",
      "Pirc: Classical",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3"
    ],
    [
      "B08a",
      "Pirc: Classical",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7"
    ],
    [
      "B08b",
      "Pirc: Classical, 5.h3",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 h3"
    ],
    [
      "B08b",
      "Pirc: Classical, 5.h3",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 h3 c6"
    ],
    [
      "B08b",
      "Pirc: Classical, 5.h3",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 h3 O-O"
    ],
    [
      "B08f",
      "Pirc: Classical, 5.a4",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 a4"
    ],
    [
      "B08f",
      "Pirc: Classical, 5.a4 c6",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 a4 c6"
    ],
    [
      "B08g",
      "Pirc: Classical, 5.Bc4",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Bc4"
    ],
    [
      "B08h",
      "Pirc: Classical, 5.Be3",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be3"
    ],
    [
      "B08j",
      "Pirc: Classical, 5.Be2",
      "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2"
    ],
    [
      "B09a",
      "Pirc: Austrian Attack",
      "e4 d6 d4 Nf6 Nc3 g6 f4"
    ],
    [
      "B09b",
      "Pirc: Austrian Attack",
      "e4 d6 d4 Nf6 Nc3 g6 f4 Bg7"
    ],
    [
      "B09d",
      "Pirc: Austrian, 5.Nf3",
      "e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3"
    ],
    [
      "B09e",
      "Pirc: Austrian, 5...O-O",
      "e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O"
    ],
    [
      "B09o",
      "Pirc: Austrian, 5...c5",
      "e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 c5"
    ],
    [
      "B10a",
      "Caro-Kann",
      "e4 c6"
    ],
    [
      "B10a",
      "Caro-Kann: 2.Ne2",
      "e4 c6 Ne2"
    ],
    [
      "B10a",
      "Caro-Kann: 2.f4",
      "e4 c6 f4"
    ],
    [
      "B10b",
      "Caro-Kann: Breyer Variation",
      "e4 c6 d3"
    ],
    [
      "B10b",
      "Caro-Kann: Breyer Variation",
      "e4 c6 d3 d5"
    ],
    [
      "B10c",
      "Caro-Kann: Breyer, 3.Nd2",
      "e4 c6 d3 d5 Nd2"
    ],
    [
      "B10d",
      "Caro-Kann: Breyer, 3.Nd2 g6",
      "e4 c6 d3 d5 Nd2 g6"
    ],
    [
      "B10e",
      "Caro-Kann: Breyer, 3.Nd2 e5",
      "e4 c6 d3 d5 Nd2 e5"
    ],
    [
      "B10f",
      "Caro-Kann: Breyer, Main Line",
      "e4 c6 d3 d5 Nd2 e5 Ngf3 Bd6 g3"
    ],
    [
      "B10g",
      "Caro-Kann: English Variation",
      "e4 c6 c4"
    ],
    [
      "B10h",
      "Caro-Kann: English Variation",
      "e4 c6 c4 e5"
    ],
    [
      "B10i",
      "Caro-Kann: English Variation",
      "e4 c6 c4 d5"
    ],
    [
      "B10i",
      "Caro-Kann: English Variation",
      "e4 c6 c4 d5 cxd5"
    ],
    [
      "B10i",
      "Caro-Kann: English Variation",
      "e4 c6 c4 d5 cxd5 cxd5"
    ],
    [
      "B10i",
      "Caro-Kann: English Variation",
      "e4 c6 c4 d5 exd5"
    ],
    [
      "B10i",
      "Caro-Kann: English Variation",
      "e4 c6 c4 d5 exd5 cxd5"
    ],
    [
      "B10j",
      "Caro-Kann: English, Exchange",
      "e4 c6 c4 d5 exd5 cxd5 cxd5"
    ],
    [
      "B10o",
      "Caro-Kann: 2.Nf3",
      "e4 c6 Nf3"
    ],
    [
      "B10p",
      "Caro-Kann: 2.Nc3",
      "e4 c6 Nc3"
    ],
    [
      "B10q",
      "Caro-Kann: 2.Nc3 d5",
      "e4 c6 Nc3 d5"
    ],
    [
      "B10r",
      "Caro-Kann: Goldman/Spielmann",
      "e4 c6 Nc3 d5 Qf3"
    ],
    [
      "B10s",
      "Caro-Kann: Two Knights Variation",
      "e4 c6 Nc3 d5 Nf3"
    ],
    [
      "B10t",
      "Caro-Kann: Two Knights, 3...dxe4",
      "e4 c6 Nc3 d5 Nf3 dxe4"
    ],
    [
      "B10t",
      "Caro-Kann: Hector Gambit",
      "e4 c6 Nc3 d5 Nf3 dxe4 Ng5"
    ],
    [
      "B11a",
      "Caro-Kann: Two Knights, 3...Bg4",
      "e4 c6 Nc3 d5 Nf3 Bg4"
    ],
    [
      "B12a",
      "Caro-Kann: 2.d4",
      "e4 c6 d4"
    ],
    [
      "B12a",
      "Caro-Kann: de Bruycker Defence",
      "e4 c6 d4 Na6"
    ],
    [
      "B12a",
      "Caro-Kann: Masi Defence",
      "e4 c6 d4 Nf6"
    ],
    [
      "B12b",
      "Caro-Kann: 2.d4 d5",
      "e4 c6 d4 d5"
    ],
    [
      "B12b",
      "Caro-Kann: Ulysses Gambit",
      "e4 c6 d4 d5 Nf3"
    ],
    [
      "B12b",
      "Caro-Kann: Ulysses Gambit",
      "e4 c6 d4 d5 Nf3 dxe4 Ng5"
    ],
    [
      "B12c",
      "Caro-Kann: Mieses Gambit",
      "e4 c6 d4 d5 Be3"
    ],
    [
      "B12d",
      "Caro-Kann: Maroczy (Fantasy) Variation",
      "e4 c6 d4 d5 f3"
    ],
    [
      "B12e",
      "Caro-Kann: Maroczy (Fantasy), 3...e6",
      "e4 c6 d4 d5 f3 e6"
    ],
    [
      "B12f",
      "Caro-Kann: Maroczy (Fantasy), 3...dxe4",
      "e4 c6 d4 d5 f3 dxe4"
    ],
    [
      "B12g",
      "Caro-Kann: 3.Nd2",
      "e4 c6 d4 d5 Nd2"
    ],
    [
      "B12g",
      "Caro-Kann: 3.Nd2 dxe4",
      "e4 c6 d4 d5 Nd2 dxe4"
    ],
    [
      "B12g",
      "Caro-Kann: Edinburgh Variation",
      "e4 c6 d4 d5 Nd2 Qb6"
    ],
    [
      "B12h",
      "Caro-Kann: Gurgenidze/Modern: 3.Nd2 g6",
      "e4 c6 d4 d5 Nd2 g6"
    ],
    [
      "B12i",
      "Caro-Kann: Advance Variation",
      "e4 c6 d4 d5 e5"
    ],
    [
      "B12j",
      "Caro-Kann: Advance, 3...c5",
      "e4 c6 d4 d5 e5 c5"
    ],
    [
      "B12j",
      "Caro-Kann: Advance, 3...c5 4.dxc5",
      "e4 c6 d4 d5 e5 c5 dxc5"
    ],
    [
      "B12l",
      "Caro-Kann: Advance, 3...Bf5",
      "e4 c6 d4 d5 e5 Bf5"
    ],
    [
      "B12l",
      "Caro-Kann: Advance, Bayonet Variation",
      "e4 c6 d4 d5 e5 Bf5 g4"
    ],
    [
      "B12m",
      "Caro-Kann: Advance, 4.h4",
      "e4 c6 d4 d5 e5 Bf5 h4"
    ],
    [
      "B12n",
      "Caro-Kann: Advance, 4.c3",
      "e4 c6 d4 d5 e5 Bf5 c3"
    ],
    [
      "B12o",
      "Caro-Kann: Advance, 4.Bd3",
      "e4 c6 d4 d5 e5 Bf5 Bd3"
    ],
    [
      "B12p",
      "Caro-Kann: Advance, 4.Nf3",
      "e4 c6 d4 d5 e5 Bf5 Nf3"
    ],
    [
      "B12p",
      "Caro-Kann: Advance, 4.Nf3 e6",
      "e4 c6 d4 d5 e5 Bf5 Nf3 e6"
    ],
    [
      "B12v",
      "Caro-Kann: Advance, 4.Nc3",
      "e4 c6 d4 d5 e5 Bf5 Nc3"
    ],
    [
      "B12v",
      "Caro-Kann: Advance, 4.Nc3 h5",
      "e4 c6 d4 d5 e5 Bf5 Nc3 h5"
    ],
    [
      "B12v",
      "Caro-Kann: Advance, 4.Nc3 Qb6",
      "e4 c6 d4 d5 e5 Bf5 Nc3 Qb6"
    ],
    [
      "B12v",
      "Caro-Kann: Advance, 4.Nc3 e6",
      "e4 c6 d4 d5 e5 Bf5 Nc3 e6"
    ],
    [
      "B13a",
      "Caro-Kann: Exchange Variation",
      "e4 c6 d4 d5 exd5"
    ],
    [
      "B13a",
      "Caro-Kann: Exchange, 3...Qxd5",
      "e4 c6 d4 d5 exd5 Qxd5"
    ],
    [
      "B13b",
      "Caro-Kann: Exchange, 3...cxd5",
      "e4 c6 d4 d5 exd5 cxd5"
    ],
    [
      "B13c",
      "Caro-Kann: Exchange, 4.Nf3",
      "e4 c6 d4 d5 exd5 cxd5 Nf3"
    ],
    [
      "B13d",
      "Caro-Kann: Exchange, 4.Nf3 Nf6",
      "e4 c6 d4 d5 exd5 cxd5 Nf3 Nf6"
    ],
    [
      "B13e",
      "Caro-Kann: Exchange, 4.Bd3",
      "e4 c6 d4 d5 exd5 cxd5 Bd3"
    ],
    [
      "B13f",
      "Caro-Kann: Exchange, 4.Bd3 Nc6",
      "e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6"
    ],
    [
      "B13n",
      "Caro-Kann: Panov-Botvinnik Attack",
      "e4 c6 d4 d5 exd5 cxd5 c4"
    ],
    [
      "B15a",
      "Caro-Kann: 3.Nc3",
      "e4 c6 d4 d5 Nc3"
    ],
    [
      "B15b",
      "Caro-Kann: Gurgenidze Counterattack",
      "e4 c6 d4 d5 Nc3 b5"
    ],
    [
      "B15c",
      "Caro-Kann: Gurgenidze/Modern",
      "e4 c6 d4 d5 Nc3 g6"
    ],
    [
      "B15d",
      "Caro-Kann: Gurgenidze: 4.Be3",
      "e4 c6 d4 d5 Nc3 g6 Be3"
    ],
    [
      "B15d",
      "Caro-Kann: Gurgenidze: 4.Be3",
      "e4 c6 d4 d5 Nc3 g6 Be3 Bg7"
    ],
    [
      "B15e",
      "Caro-Kann: Gurgenidze: 4.h3",
      "e4 c6 d4 d5 Nc3 g6 h3"
    ],
    [
      "B15e",
      "Caro-Kann: Gurgenidze: 4.h3",
      "e4 c6 d4 d5 Nc3 g6 h3 Bg7"
    ],
    [
      "B15f",
      "Caro-Kann: Gurgenidze: 4.e5",
      "e4 c6 d4 d5 Nc3 g6 e5"
    ],
    [
      "B15f",
      "Caro-Kann: Gurgenidze: 4.e5",
      "e4 c6 d4 d5 Nc3 g6 e5 Bg7"
    ],
    [
      "B15j",
      "Caro-Kann: Gurgenidze: 4.Nf3",
      "e4 c6 d4 d5 Nc3 g6 Nf3"
    ],
    [
      "B15k",
      "Caro-Kann: Gurgenidze: 4.Nf3 Bg7",
      "e4 c6 d4 d5 Nc3 g6 Nf3 Bg7"
    ],
    [
      "B15p",
      "Caro-Kann: 3.Nc3 dxe4",
      "e4 c6 d4 d5 Nc3 dxe4"
    ],
    [
      "B15p",
      "Caro-Kann: Rasa-Studier Gambit",
      "e4 c6 d4 d5 Nc3 dxe4 f3"
    ],
    [
      "B15p",
      "Caro-Kann: von Hennig Gambit",
      "e4 c6 d4 d5 Nc3 dxe4 Bc4"
    ],
    [
      "B15q",
      "Caro-Kann: 4.Nxe4",
      "e4 c6 d4 d5 Nc3 dxe4 Nxe4"
    ],
    [
      "B15r",
      "Caro-Kann: 4.Nxe4 Nf6",
      "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6"
    ],
    [
      "B18a",
      "Caro-Kann: Classical",
      "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5"
    ],
    [
      "B20",
      "Sicilian Defence",
      "e4 c5"
    ],
    [
      "B20",
      "Sicilian: Mengarini",
      "e4 c5 a3"
    ],
    [
      "B20",
      "Sicilian: Keres Variation (2.Ne2)",
      "e4 c5 Ne2"
    ],
    [
      "B20",
      "Sicilian: 2.Bc4",
      "e4 c5 Bc4"
    ],
    [
      "B20",
      "Sicilian: Wing Gambit",
      "e4 c5 b4"
    ],
    [
      "B20",
      "Sicilian: Wing Gambit, Santasiere Variation",
      "e4 c5 b4 cxb4 c4"
    ],
    [
      "B20",
      "Sicilian: Wing Gambit, Marshall Variation",
      "e4 c5 b4 cxb4 a3"
    ],
    [
      "B20",
      "Sicilian: Wing Gambit, Carlsbad Variation",
      "e4 c5 b4 cxb4 a3 bxa3"
    ],
    [
      "B20",
      "Sicilian: Snyder",
      "e4 c5 b3"
    ],
    [
      "B20",
      "Sicilian: Snyder, 2...e6",
      "e4 c5 b3 e6"
    ],
    [
      "B20",
      "Sicilian: Snyder, 2...d6",
      "e4 c5 b3 d6"
    ],
    [
      "B20",
      "Sicilian: Snyder, 2...Nc6",
      "e4 c5 b3 Nc6"
    ],
    [
      "B20",
      "Sicilian: English (2.c4)",
      "e4 c5 c4"
    ],
    [
      "B20",
      "Sicilian: English, 2...e6",
      "e4 c5 c4 e6"
    ],
    [
      "B20",
      "Sicilian: English, 2...d6",
      "e4 c5 c4 d6"
    ],
    [
      "B20",
      "Sicilian: English, 2...Nc6",
      "e4 c5 c4 Nc6"
    ],
    [
      "B20",
      "Sicilian: English, 2...Nc6 3.Nf3",
      "e4 c5 c4 Nc6 Nf3"
    ],
    [
      "B20",
      "Sicilian: English, 2...Nc6 3.Ne2",
      "e4 c5 c4 Nc6 Ne2"
    ],
    [
      "B20",
      "Sicilian: English, 2...Nc6 3.Nc3",
      "e4 c5 c4 Nc6 Nc3"
    ],
    [
      "B20",
      "Sicilian: English, 2...Nc6 3.Nc3 g6",
      "e4 c5 c4 Nc6 Nc3 g6"
    ],
    [
      "B20",
      "Sicilian: 2.g3",
      "e4 c5 g3"
    ],
    [
      "B20",
      "Sicilian: 2.g3",
      "e4 c5 g3 g6"
    ],
    [
      "B20",
      "Sicilian: 2.g3",
      "e4 c5 g3 g6 Bg2 Bg7"
    ],
    [
      "B20",
      "Sicilian: 2.g3",
      "e4 c5 g3 g6 Bg2 Bg7 f4"
    ],
    [
      "B20",
      "Sicilian: 2.g3",
      "e4 c5 g3 g6 Bg2 Bg7 f4 d6"
    ],
    [
      "B20",
      "Sicilian: 2.d3",
      "e4 c5 d3"
    ],
    [
      "B20",
      "Sicilian: 2.d3 e6",
      "e4 c5 d3 e6"
    ],
    [
      "B20",
      "Sicilian: 2.d3 e6 3.g3",
      "e4 c5 d3 e6 g3"
    ],
    [
      "B20",
      "Sicilian: 2.d3 Nc6",
      "e4 c5 d3 Nc6"
    ],
    [
      "B20",
      "Sicilian: 2.d3 Nc6 3.g3",
      "e4 c5 d3 Nc6 g3"
    ],
    [
      "B21a",
      "Sicilian: Grand Prix Attack",
      "e4 c5 f4"
    ],
    [
      "B21b",
      "Sicilian: Grand Prix, 2...g6",
      "e4 c5 f4 g6"
    ],
    [
      "B21c",
      "Sicilian: Grand Prix, 2...d6",
      "e4 c5 f4 d6"
    ],
    [
      "B21d",
      "Sicilian: Grand Prix, 2...e6",
      "e4 c5 f4 e6"
    ],
    [
      "B21d",
      "Sicilian: Grand Prix, 2...e6 3.Nf3",
      "e4 c5 f4 e6 Nf3"
    ],
    [
      "B21e",
      "Sicilian: Grand Prix, 2...Nc6",
      "e4 c5 f4 Nc6"
    ],
    [
      "B21e",
      "Sicilian: Grand Prix, 2...Nc6 3.d3",
      "e4 c5 f4 Nc6 d3"
    ],
    [
      "B21f",
      "Sicilian: Grand Prix, 2...Nc6 3.Nf3",
      "e4 c5 f4 Nc6 Nf3"
    ],
    [
      "B21g",
      "Sicilian: Grand Prix, 2...Nc6 3.Nf3 e6",
      "e4 c5 f4 Nc6 Nf3 e6"
    ],
    [
      "B21h",
      "Sicilian: Grand Prix, 2...Nc6 3.Nf3 g6",
      "e4 c5 f4 Nc6 Nf3 g6"
    ],
    [
      "B21i",
      "Sicilian: Grand Prix, Tal Defence",
      "e4 c5 f4 d5"
    ],
    [
      "B21i",
      "Sicilian: Grand Prix, Tal Defence, 3.e5",
      "e4 c5 f4 d5 e5"
    ],
    [
      "B21i",
      "Sicilian: Grand Prix, Toilet Variation",
      "e4 c5 f4 d5 Nc3"
    ],
    [
      "B21j",
      "Sicilian: Grand Prix, Tal Defence, 3.exd5",
      "e4 c5 f4 d5 exd5"
    ],
    [
      "B21k",
      "Sicilian: Grand Prix, Tal Gambit",
      "e4 c5 f4 d5 exd5 Nf6"
    ],
    [
      "B21m",
      "Sicilian: Smith-Morra Gambit",
      "e4 c5 d4"
    ],
    [
      "B21m",
      "Sicilian: Smith-Morra, 2...d5",
      "e4 c5 d4 d5"
    ],
    [
      "B21m",
      "Sicilian: Smith-Morra, 2...cxd4",
      "e4 c5 d4 cxd4"
    ],
    [
      "B21m",
      "Sicilian: Halasz Gambit",
      "e4 c5 d4 cxd4 f4"
    ],
    [
      "B21n",
      "Sicilian: Smith-Morra, Morphy Gambit",
      "e4 c5 d4 cxd4 Nf3"
    ],
    [
      "B21o",
      "Sicilian: Smith-Morra, 3.c3",
      "e4 c5 d4 cxd4 c3"
    ],
    [
      "B21p",
      "Sicilian: Smith-Morra, 3.c3 Nf6",
      "e4 c5 d4 cxd4 c3 Nf6"
    ],
    [
      "B21q",
      "Sicilian: Smith-Morra, 3.c3 d5",
      "e4 c5 d4 cxd4 c3 d5"
    ],
    [
      "B21r",
      "Sicilian: Smith-Morra, 3.c3 d3",
      "e4 c5 d4 cxd4 c3 d3"
    ],
    [
      "B21s",
      "Sicilian: Smith-Morra Accepted",
      "e4 c5 d4 cxd4 c3 dxc3"
    ],
    [
      "B21s",
      "Sicilian: Smith-Morra Accepted",
      "e4 c5 d4 cxd4 c3 dxc3 Nxc3"
    ],
    [
      "B22a",
      "Sicilian: Alapin",
      "e4 c5 c3"
    ],
    [
      "B22a",
      "Sicilian: Alapin, 2...e5",
      "e4 c5 c3 e5"
    ],
    [
      "B22a",
      "Sicilian: Alapin, 2...g6",
      "e4 c5 c3 g6"
    ],
    [
      "B22a",
      "Sicilian: Alapin, 2...g6 3.d4",
      "e4 c5 c3 g6 d4"
    ],
    [
      "B22a",
      "Sicilian: Alapin, 2...g6 3.d4 cxd4",
      "e4 c5 c3 g6 d4 cxd4"
    ],
    [
      "B22b",
      "Sicilian: Alapin, 2...Nc6",
      "e4 c5 c3 Nc6"
    ],
    [
      "B22b",
      "Sicilian: Alapin, 2...Nc6 3.Nf3",
      "e4 c5 c3 Nc6 Nf3"
    ],
    [
      "B22b",
      "Sicilian: Alapin, 2...Nc6 3.d4",
      "e4 c5 c3 Nc6 d4"
    ],
    [
      "B22c",
      "Sicilian: Alapin, 2...e6",
      "e4 c5 c3 e6"
    ],
    [
      "B22c",
      "Sicilian: Alapin, 2...e6 3.Nf3",
      "e4 c5 c3 e6 Nf3"
    ],
    [
      "B22c",
      "Sicilian: Alapin, 2...e6 3.Nf3 d5",
      "e4 c5 c3 e6 Nf3 d5"
    ],
    [
      "B22d",
      "Sicilian: Alapin, 2...e6 3.d4",
      "e4 c5 c3 e6 d4"
    ],
    [
      "B22d",
      "Sicilian: Alapin, 2...e6 3.d4 d5",
      "e4 c5 c3 e6 d4 d5"
    ],
    [
      "B22e",
      "Sicilian: Alapin, 2...d6",
      "e4 c5 c3 d6"
    ],
    [
      "B22f",
      "Sicilian: Alapin, 2...d5",
      "e4 c5 c3 d5"
    ],
    [
      "B22f",
      "Sicilian: Alapin, 2...d5 3.exd5",
      "e4 c5 c3 d5 exd5"
    ],
    [
      "B22f",
      "Sicilian: Alapin, 2...d5 3.exd5 Qxd5",
      "e4 c5 c3 d5 exd5 Qxd5"
    ],
    [
      "B22o",
      "Sicilian: Alapin, 2...Nf6",
      "e4 c5 c3 Nf6"
    ],
    [
      "B22o",
      "Sicilian: Alapin, 2...Nf6 3.e5",
      "e4 c5 c3 Nf6 e5"
    ],
    [
      "B22o",
      "Sicilian: Alapin, 2...Nf6 3.e5 Nd5",
      "e4 c5 c3 Nf6 e5 Nd5"
    ],
    [
      "B23a",
      "Sicilian: Closed",
      "e4 c5 Nc3"
    ],
    [
      "B23b",
      "Sicilian: Closed",
      "e4 c5 Nc3 g6"
    ],
    [
      "B23c",
      "Sicilian: Closed",
      "e4 c5 Nc3 d6"
    ],
    [
      "B23c",
      "Sicilian: Closed",
      "e4 c5 Nc3 d6 Nge2"
    ],
    [
      "B23d",
      "Sicilian: Closed",
      "e4 c5 Nc3 d6 g3"
    ],
    [
      "B23e",
      "Sicilian: Closed",
      "e4 c5 Nc3 d6 f4"
    ],
    [
      "B23f",
      "Sicilian: Closed",
      "e4 c5 Nc3 e6"
    ],
    [
      "B23g",
      "Sicilian: Closed",
      "e4 c5 Nc3 e6 f4"
    ],
    [
      "B23h",
      "Sicilian: Closed",
      "e4 c5 Nc3 e6 Nge2"
    ],
    [
      "B23i",
      "Sicilian: Closed",
      "e4 c5 Nc3 e6 g3"
    ],
    [
      "B23j",
      "Sicilian: Closed, Korchnoi Variation",
      "e4 c5 Nc3 e6 g3 d5"
    ],
    [
      "B23k",
      "Sicilian: Closed, 2...Nc6",
      "e4 c5 Nc3 Nc6"
    ],
    [
      "B23l",
      "Sicilian: Closed, 2...Nc6 3.Bb5",
      "e4 c5 Nc3 Nc6 Bb5"
    ],
    [
      "B23m",
      "Sicilian: Closed, 2...Nc6 3.Bb5 Nd4",
      "e4 c5 Nc3 Nc6 Bb5 Nd4"
    ],
    [
      "B23n",
      "Sicilian: Chameleon Variation",
      "e4 c5 Nc3 Nc6 Nge2"
    ],
    [
      "B23n",
      "Sicilian: Chameleon, 3...e5",
      "e4 c5 Nc3 Nc6 Nge2 e5"
    ],
    [
      "B23n",
      "Sicilian: Chameleon, 3...g6",
      "e4 c5 Nc3 Nc6 Nge2 g6"
    ],
    [
      "B23o",
      "Sicilian: Closed, Grand Prix",
      "e4 c5 Nc3 Nc6 f4"
    ],
    [
      "B23o",
      "Sicilian: Closed, Grand Prix, 3...d6",
      "e4 c5 Nc3 Nc6 f4 d6"
    ],
    [
      "B23q",
      "Sicilian: Closed, Grand Prix, 3...e6",
      "e4 c5 Nc3 Nc6 f4 e6"
    ],
    [
      "B23s",
      "Sicilian: Closed, Grand Prix, 3...g6",
      "e4 c5 Nc3 Nc6 f4 g6"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3",
      "e4 c5 Nc3 Nc6 g3"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3 e6",
      "e4 c5 Nc3 Nc6 g3 e6"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3 g6",
      "e4 c5 Nc3 Nc6 g3 g6"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3 g6",
      "e4 c5 Nc3 Nc6 g3 g6 d3"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3 g6",
      "e4 c5 Nc3 Nc6 g3 g6 Bg2"
    ],
    [
      "B24",
      "Sicilian: Closed, 3.g3 g6",
      "e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7"
    ],
    [
      "B27a",
      "Sicilian: 2.Nf3",
      "e4 c5 Nf3"
    ],
    [
      "B27b",
      "Sicilian: Mongoose Variation",
      "e4 c5 Nf3 Qa5"
    ],
    [
      "B27c",
      "Sicilian: Quinteros Variation",
      "e4 c5 Nf3 Qc7"
    ],
    [
      "B27d",
      "Sicilian: Katalimov Variation",
      "e4 c5 Nf3 b6"
    ],
    [
      "B27e",
      "Sicilian: Hungarian Variation",
      "e4 c5 Nf3 g6"
    ],
    [
      "B27f",
      "Sicilian: Hungarian, 3.c4",
      "e4 c5 Nf3 g6 c4"
    ],
    [
      "B27g",
      "Sicilian: Hungarian, 3.c3",
      "e4 c5 Nf3 g6 c3"
    ],
    [
      "B27j",
      "Sicilian: Hungarian, 3.d4",
      "e4 c5 Nf3 g6 d4"
    ],
    [
      "B27k",
      "Sicilian: Hungarian, 3.d4 cxd4",
      "e4 c5 Nf3 g6 d4 cxd4"
    ],
    [
      "B27m",
      "Sicilian: Accelerated Pterodactyl",
      "e4 c5 Nf3 g6 d4 Bg7"
    ],
    [
      "B28a",
      "Sicilian: O'Kelly Variation",
      "e4 c5 Nf3 a6"
    ],
    [
      "B28b",
      "Sicilian: O'Kelly, 3.Nc3",
      "e4 c5 Nf3 a6 Nc3"
    ],
    [
      "B28c",
      "Sicilian: O'Kelly, 3.d4",
      "e4 c5 Nf3 a6 d4"
    ],
    [
      "B28d",
      "Sicilian: O'Kelly, 3.d4 cxd4 4.Nxd4",
      "e4 c5 Nf3 a6 d4 cxd4 Nxd4"
    ],
    [
      "B28f",
      "Sicilian: O'Kelly, 3.c4",
      "e4 c5 Nf3 a6 c4"
    ],
    [
      "B28g",
      "Sicilian: O'Kelly, 3.c4 e6",
      "e4 c5 Nf3 a6 c4 e6"
    ],
    [
      "B28h",
      "Sicilian: O'Kelly, 3.c3",
      "e4 c5 Nf3 a6 c3"
    ],
    [
      "B28i",
      "Sicilian: O'Kelly, 3.c3 e6",
      "e4 c5 Nf3 a6 c3 e6"
    ],
    [
      "B28j",
      "Sicilian: O'Kelly, 3.c3 d5",
      "e4 c5 Nf3 a6 c3 d5"
    ],
    [
      "B29a",
      "Sicilian: Nimzowitsch",
      "e4 c5 Nf3 Nf6"
    ],
    [
      "B29b",
      "Sicilian: Nimzowitsch, 3.d3",
      "e4 c5 Nf3 Nf6 d3"
    ],
    [
      "B29c",
      "Sicilian: Nimzowitsch, 3.Nc3",
      "e4 c5 Nf3 Nf6 Nc3"
    ],
    [
      "B29d",
      "Sicilian: Nimzowitsch, 3.Nc3 d5",
      "e4 c5 Nf3 Nf6 Nc3 d5"
    ],
    [
      "B29f",
      "Sicilian: Nimzowitsch, 3.e5",
      "e4 c5 Nf3 Nf6 e5"
    ],
    [
      "B29f",
      "Sicilian: Nimzowitsch, 3.e5 Nd5",
      "e4 c5 Nf3 Nf6 e5 Nd5"
    ],
    [
      "B29g",
      "Sicilian: Nimzowitsch, 4.c4",
      "e4 c5 Nf3 Nf6 e5 Nd5 c4"
    ],
    [
      "B29h",
      "Sicilian: Nimzowitsch, 4.d4",
      "e4 c5 Nf3 Nf6 e5 Nd5 d4"
    ],
    [
      "B29i",
      "Sicilian: Nimzowitsch, 4.Nc3",
      "e4 c5 Nf3 Nf6 e5 Nd5 Nc3"
    ],
    [
      "B30a",
      "Sicilian: 2...Nc6",
      "e4 c5 Nf3 Nc6"
    ],
    [
      "B30b",
      "Sicilian: 2...Nc6 3.b3",
      "e4 c5 Nf3 Nc6 b3"
    ],
    [
      "B30c",
      "Sicilian: 2...Nc6 3.d3",
      "e4 c5 Nf3 Nc6 d3"
    ],
    [
      "B30c",
      "Sicilian: 2...Nc6 3.d3 Nf6",
      "e4 c5 Nf3 Nc6 d3 Nf6"
    ],
    [
      "B30d",
      "Sicilian: 2...Nc6 3.g3",
      "e4 c5 Nf3 Nc6 g3"
    ],
    [
      "B30e",
      "Sicilian: 2...Nc6 3.g3 e6 4.d3",
      "e4 c5 Nf3 Nc6 g3 e6 d3"
    ],
    [
      "B30f",
      "Sicilian: 2...Nc6 3.g3 e6 4.d3 d5",
      "e4 c5 Nf3 Nc6 g3 e6 d3 d5"
    ],
    [
      "B30g",
      "Sicilian: 2...Nc6 3.Bc4",
      "e4 c5 Nf3 Nc6 Bc4"
    ],
    [
      "B30h",
      "Sicilian: 2...Nc6 3.Nc3",
      "e4 c5 Nf3 Nc6 Nc3"
    ],
    [
      "B30h",
      "Sicilian: 2...Nc6 3.Nc3 Nf6",
      "e4 c5 Nf3 Nc6 Nc3 Nf6"
    ],
    [
      "B30i",
      "Sicilian: 2...Nc6 3.Nc3 g6",
      "e4 c5 Nf3 Nc6 Nc3 g6"
    ],
    [
      "B30j",
      "Sicilian: 2...Nc6 3.Nc3 e5",
      "e4 c5 Nf3 Nc6 Nc3 e5"
    ],
    [
      "B30k",
      "Sicilian: Rossolimo",
      "e4 c5 Nf3 Nc6 Bb5"
    ],
    [
      "B30l",
      "Sicilian: Rossolimo, 3...Qb6",
      "e4 c5 Nf3 Nc6 Bb5 Qb6"
    ],
    [
      "B30m",
      "Sicilian: Rossolimo, 3...Nf6",
      "e4 c5 Nf3 Nc6 Bb5 Nf6"
    ],
    [
      "B30n",
      "Sicilian: Rossolimo, 3...e6",
      "e4 c5 Nf3 Nc6 Bb5 e6"
    ],
    [
      "B30o",
      "Sicilian: Rossolimo, 3...e6 4.b3",
      "e4 c5 Nf3 Nc6 Bb5 e6 b3"
    ],
    [
      "B30p",
      "Sicilian: Rossolimo, 3...e6 4.Nc3",
      "e4 c5 Nf3 Nc6 Bb5 e6 Nc3"
    ],
    [
      "B30q",
      "Sicilian: Rossolimo, 3...e6 4.Bxc6",
      "e4 c5 Nf3 Nc6 Bb5 e6 Bxc6"
    ],
    [
      "B30r",
      "Sicilian: Rossolimo, 3...e6 4.O-O",
      "e4 c5 Nf3 Nc6 Bb5 e6 O-O"
    ],
    [
      "B31a",
      "Sicilian: Rossolimo, 3...g6",
      "e4 c5 Nf3 Nc6 Bb5 g6"
    ],
    [
      "B31b",
      "Sicilian: Rossolimo, 3...g6 4.Nc3",
      "e4 c5 Nf3 Nc6 Bb5 g6 Nc3"
    ],
    [
      "B31c",
      "Sicilian: Rossolimo, 3...g6 4.Bxc6",
      "e4 c5 Nf3 Nc6 Bb5 g6 Bxc6"
    ],
    [
      "B31g",
      "Sicilian: Rossolimo, 3...g6 4.O-O",
      "e4 c5 Nf3 Nc6 Bb5 g6 O-O"
    ],
    [
      "B32a",
      "Sicilian: 2...Nc6 3.d4",
      "e4 c5 Nf3 Nc6 d4"
    ],
    [
      "B32b",
      "Sicilian: 2...Nc6 3.d4 cxd4",
      "e4 c5 Nf3 Nc6 d4 cxd4"
    ],
    [
      "B32c",
      "Sicilian: Open, 2...Nc6",
      "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4"
    ],
    [
      "B32f",
      "Sicilian: Flohr Variation",
      "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Qc7"
    ],
    [
      "B32g",
      "Sicilian: Flohr, 5.Nb5",
      "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Qc7 Nb5"
    ],
    [
      "B32i",
      "Sicilian: Lowenthal",
      "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5"
    ],
    [
      "B33a",
      "Sicilian: Open, 2...Nc6",
      "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6"
    ],
    [
      "B40a",
      "Sicilian: 2...e6",
      "e4 c5 Nf3 e6"
    ],
    [
      "B40b",
      "Sicilian: 2...e6 3.c4",
      "e4 c5 Nf3 e6 c4"
    ],
    [
      "B40c",
      "Sicilian: 2...e6 3.b3",
      "e4 c5 Nf3 e6 b3"
    ],
    [
      "B40d",
      "Sicilian: 2...e6 3.b3 Nc6",
      "e4 c5 Nf3 e6 b3 Nc6"
    ],
    [
      "B40e",
      "Sicilian: 2...e6 3.g3",
      "e4 c5 Nf3 e6 g3"
    ],
    [
      "B40f",
      "Sicilian: 2...e6 3.d3",
      "e4 c5 Nf3 e6 d3"
    ],
    [
      "B40g",
      "Sicilian: 2...e6 3.Nc3",
      "e4 c5 Nf3 e6 Nc3"
    ],
    [
      "B40h",
      "Sicilian: 2...e6 3.Nc3 Nc6",
      "e4 c5 Nf3 e6 Nc3 Nc6"
    ],
    [
      "B40i",
      "Sicilian: 2...e6 3.d4",
      "e4 c5 Nf3 e6 d4"
    ],
    [
      "B40j",
      "Sicilian: Marshall Variation",
      "e4 c5 Nf3 e6 d4 d5"
    ],
    [
      "B40k",
      "Sicilian: Open, 2...e6",
      "e4 c5 Nf3 e6 d4 cxd4"
    ],
    [
      "B40l",
      "Sicilian: Open, 2...e6, 4.Nxd4",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4"
    ],
    [
      "B41a",
      "Sicilian: Kan (Paulsen)",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6"
    ],
    [
      "B41b",
      "Sicilian: Kan, 5.g3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 g3"
    ],
    [
      "B41c",
      "Sicilian: Kan, 5.Be3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Be3"
    ],
    [
      "B41d",
      "Sicilian: Kan, 5.Be2",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Be2"
    ],
    [
      "B42a",
      "Sicilian: Kan, 5.Bd3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3"
    ],
    [
      "B43a",
      "Sicilian: Kan, 5.Nc3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3"
    ],
    [
      "B44a",
      "Sicilian: Taimanov",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6"
    ],
    [
      "B44b",
      "Sicilian: Taimanov, 5.g3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 g3"
    ],
    [
      "B44c",
      "Sicilian: Taimanov, 5.Be2",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Be2"
    ],
    [
      "B44d",
      "Sicilian: Taimanov, 5.c4",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 c4"
    ],
    [
      "B45a",
      "Sicilian: Taimanov, 5.Nc3",
      "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3"
    ],
    [
      "B50a",
      "Sicilian: 2.Nf3 d6",
      "e4 c5 Nf3 d6"
    ],
    [
      "B50b",
      "Sicilian: Wing Gambit deferred",
      "e4 c5 Nf3 d6 b4"
    ],
    [
      "B50c",
      "Sicilian: 2.Nf3 d6 3.b3",
      "e4 c5 Nf3 d6 b3"
    ],
    [
      "B50d",
      "Sicilian: 2.Nf3 d6 3.b3 e6",
      "e4 c5 Nf3 d6 b3 e6"
    ],
    [
      "B50e",
      "Sicilian: 2.Nf3 d6 3.d3",
      "e4 c5 Nf3 d6 d3"
    ],
    [
      "B50f",
      "Sicilian: 2.Nf3 d6 3.g3",
      "e4 c5 Nf3 d6 g3"
    ],
    [
      "B50g",
      "Sicilian: 2.Nf3 d6 3.Bc4",
      "e4 c5 Nf3 d6 Bc4"
    ],
    [
      "B50h",
      "Sicilian: 2.Nf3 d6 3.Bc4 Nf6 4.d3",
      "e4 c5 Nf3 d6 Bc4 Nf6 d3"
    ],
    [
      "B50i",
      "Sicilian: 2.Nf3 d6 3.Nc3",
      "e4 c5 Nf3 d6 Nc3"
    ],
    [
      "B50j",
      "Sicilian: 2.Nf3 d6 3.Nc3 e6",
      "e4 c5 Nf3 d6 Nc3 e6"
    ],
    [
      "B50k",
      "Sicilian: 2.Nf3 d6 3.Nc3 Nf6",
      "e4 c5 Nf3 d6 Nc3 Nf6"
    ],
    [
      "B50l",
      "Sicilian: 2.Nf3 d6 3.c3",
      "e4 c5 Nf3 d6 c3"
    ],
    [
      "B50m",
      "Sicilian: 2.Nf3 d6 3.c3 Nf6",
      "e4 c5 Nf3 d6 c3 Nf6"
    ],
    [
      "B50n",
      "Sicilian: 2.Nf3 d6 3.c3 Nf6 4.h3",
      "e4 c5 Nf3 d6 c3 Nf6 h3"
    ],
    [
      "B50p",
      "Sicilian: 2.Nf3 d6 3.c3 Nf6 4.Bc4",
      "e4 c5 Nf3 d6 c3 Nf6 Bc4"
    ],
    [
      "B50q",
      "Sicilian: 2.Nf3 d6 3.c3 Nf6 4.Bd3",
      "e4 c5 Nf3 d6 c3 Nf6 Bd3"
    ],
    [
      "B50s",
      "Sicilian: 2.Nf3 d6 3.c3 Nf6 4.Be2",
      "e4 c5 Nf3 d6 c3 Nf6 Be2"
    ],
    [
      "B51a",
      "Sicilian: 3.Bb5+",
      "e4 c5 Nf3 d6 Bb5+"
    ],
    [
      "B51a",
      "Sicilian: 3.Bb5+ Nd7",
      "e4 c5 Nf3 d6 Bb5+ Nd7"
    ],
    [
      "B51b",
      "Sicilian: 3.Bb5+ Nd7 4.c3",
      "e4 c5 Nf3 d6 Bb5+ Nd7 c3"
    ],
    [
      "B51c",
      "Sicilian: 3.Bb5+ Nd7 4.O-O",
      "e4 c5 Nf3 d6 Bb5+ Nd7 O-O"
    ],
    [
      "B51d",
      "Sicilian: 3.Bb5+ Nd7 4.O-O Nf6",
      "e4 c5 Nf3 d6 Bb5+ Nd7 O-O Nf6"
    ],
    [
      "B51f",
      "Sicilian: 3.Bb5+ Nd7 4.d4",
      "e4 c5 Nf3 d6 Bb5+ Nd7 d4"
    ],
    [
      "B51f",
      "Sicilian: 3.Bb5+ Nd7 4.d4 cxd4",
      "e4 c5 Nf3 d6 Bb5+ Nd7 d4 cxd4"
    ],
    [
      "B51g",
      "Sicilian: 3.Bb5+ Nd7 4.d4 Nf6",
      "e4 c5 Nf3 d6 Bb5+ Nd7 d4 Nf6"
    ],
    [
      "B51k",
      "Sicilian: 3.Bb5+ Nc6",
      "e4 c5 Nf3 d6 Bb5+ Nc6"
    ],
    [
      "B51l",
      "Sicilian: 3.Bb5+ Nc6 4.Bxc6+",
      "e4 c5 Nf3 d6 Bb5+ Nc6 Bxc6+"
    ],
    [
      "B51m",
      "Sicilian: 3.Bb5+ Nc6 4.O-O",
      "e4 c5 Nf3 d6 Bb5+ Nc6 O-O"
    ],
    [
      "B51n",
      "Sicilian: 3.Bb5+ Nc6 4.O-O Bd7",
      "e4 c5 Nf3 d6 Bb5+ Nc6 O-O Bd7"
    ],
    [
      "B52a",
      "Sicilian: 3.Bb5+ Bd7",
      "e4 c5 Nf3 d6 Bb5+ Bd7"
    ],
    [
      "B53a",
      "Sicilian: 2...d6 3.d4",
      "e4 c5 Nf3 d6 d4"
    ],
    [
      "B53b",
      "Sicilian: 2...d6 3.d4 Nf6",
      "e4 c5 Nf3 d6 d4 Nf6"
    ],
    [
      "B53c",
      "Sicilian: 2...d6 3.d4 cxd4",
      "e4 c5 Nf3 d6 d4 cxd4"
    ],
    [
      "B53d",
      "Sicilian, Chekhover Variation",
      "e4 c5 Nf3 d6 d4 cxd4 Qxd4"
    ],
    [
      "B53e",
      "Sicilian, Chekhover, 4...Bd7",
      "e4 c5 Nf3 d6 d4 cxd4 Qxd4 Bd7"
    ],
    [
      "B53f",
      "Sicilian, Chekhover, 4...a6",
      "e4 c5 Nf3 d6 d4 cxd4 Qxd4 a6"
    ],
    [
      "B53k",
      "Sicilian, Chekhover, 4...Nf6",
      "e4 c5 Nf3 d6 d4 cxd4 Qxd4 Nf6"
    ],
    [
      "B53l",
      "Sicilian, Chekhover, 4...Nc6",
      "e4 c5 Nf3 d6 d4 cxd4 Qxd4 Nc6"
    ],
    [
      "B54a",
      "Sicilian: Open, 2...d6",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4"
    ],
    [
      "B54b",
      "Sicilian: Open, 2...d6, 4...e5",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 e5"
    ],
    [
      "B54c",
      "Sicilian: Open, 2...d6, 4...a6",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 a6"
    ],
    [
      "B54d",
      "Sicilian: Open, 2...d6, 4...Nf6",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6"
    ],
    [
      "B57a",
      "Sicilian: Sozin",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bc4"
    ],
    [
      "B70a",
      "Sicilian: Dragon",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6"
    ],
    [
      "B80a",
      "Sicilian: Scheveningen",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6"
    ],
    [
      "B90a",
      "Sicilian: Najdorf",
      "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6"
    ],
    [
      "C00a",
      "French",
      "e4 e6"
    ],
    [
      "C00a",
      "French: Bird Variation",
      "e4 e6 Bb5"
    ],
    [
      "C00b",
      "French: Reti (Spielmann) Variation",
      "e4 e6 b3"
    ],
    [
      "C00c",
      "French: La Bourdonnais Variation",
      "e4 e6 f4"
    ],
    [
      "C00d",
      "French: Steinitz Attack",
      "e4 e6 e5"
    ],
    [
      "C00e",
      "French: Steiner (Anglo-French) Variation",
      "e4 e6 c4"
    ],
    [
      "C00e",
      "French: Steiner (Anglo-French) Variation",
      "e4 e6 c4 d5"
    ],
    [
      "C00e",
      "French: Orthoschnapp Gambit",
      "e4 e6 c4 d5 cxd5 exd5 Qb3"
    ],
    [
      "C00f",
      "French: 2.Nc3",
      "e4 e6 Nc3"
    ],
    [
      "C00f",
      "French: 2.Nc3 d5",
      "e4 e6 Nc3 d5"
    ],
    [
      "C00f",
      "French: Pelikan Variation",
      "e4 e6 Nc3 d5 f4"
    ],
    [
      "C00g",
      "French: Chigorin Variation",
      "e4 e6 Qe2"
    ],
    [
      "C00h",
      "French: Chigorin, 2...c5",
      "e4 e6 Qe2 c5"
    ],
    [
      "C00i",
      "French: Chigorin, 2...c5 3.Nf3",
      "e4 e6 Qe2 c5 Nf3"
    ],
    [
      "C00j",
      "French: 2.Nf3",
      "e4 e6 Nf3"
    ],
    [
      "C00j",
      "French: 2.Nf3 d5",
      "e4 e6 Nf3 d5"
    ],
    [
      "C00j",
      "French: 2.Nf3 d5 3.e5",
      "e4 e6 Nf3 d5 e5"
    ],
    [
      "C00j",
      "French: 2.Nf3 d5 3.e5 c5",
      "e4 e6 Nf3 d5 e5 c5"
    ],
    [
      "C00k",
      "French: Wing Gambit",
      "e4 e6 Nf3 d5 e5 c5 b4"
    ],
    [
      "C00l",
      "French: Two Knights Variation",
      "e4 e6 Nf3 d5 Nc3"
    ],
    [
      "C00m",
      "French: KIA 2.d3",
      "e4 e6 d3"
    ],
    [
      "C00m",
      "French: KIA 2.d3 d5",
      "e4 e6 d3 d5"
    ],
    [
      "C00n",
      "French: KIA 2.d3 d5 3.Qe2",
      "e4 e6 d3 d5 Qe2"
    ],
    [
      "C00o",
      "French: KIA 2.d3 d5 3.Qe2 Nf6",
      "e4 e6 d3 d5 Qe2 Nf6"
    ],
    [
      "C00p",
      "French: KIA 2.d3 d5 3.Nd2",
      "e4 e6 d3 d5 Nd2"
    ],
    [
      "C00q",
      "French: KIA 2.d3 d5 3.Nd2 c5",
      "e4 e6 d3 d5 Nd2 c5"
    ],
    [
      "C00r",
      "French: KIA 2.d3 d5 3.Nd2 Nf6",
      "e4 e6 d3 d5 Nd2 Nf6"
    ],
    [
      "C00s",
      "French: KIA, Reversed Philidor",
      "e4 e6 d3 d5 Nd2 Nf6 Ngf3"
    ],
    [
      "C00w",
      "French: 2.d4",
      "e4 e6 d4"
    ],
    [
      "C00w",
      "French: St. George",
      "e4 e6 d4 a6"
    ],
    [
      "C00w",
      "French: Franco-Benoni",
      "e4 e6 d4 c5"
    ],
    [
      "C00x",
      "French: 2.d4 d5",
      "e4 e6 d4 d5"
    ],
    [
      "C00x",
      "French: Alapin-Diemer Gambit (ADG)",
      "e4 e6 d4 d5 Be3"
    ],
    [
      "C00y",
      "French: Schlechter",
      "e4 e6 d4 d5 Bd3"
    ],
    [
      "C01a",
      "French: Exchange",
      "e4 e6 d4 d5 exd5"
    ],
    [
      "C01a",
      "French: Exchange, 3...Qxd5",
      "e4 e6 d4 d5 exd5 Qxd5"
    ],
    [
      "C01b",
      "French: Exchange",
      "e4 e6 d4 d5 exd5 exd5"
    ],
    [
      "C01c",
      "French: Exchange, 4.c4",
      "e4 e6 d4 d5 exd5 exd5 c4"
    ],
    [
      "C01c",
      "French: Exchange, 4.c4 c6",
      "e4 e6 d4 d5 exd5 exd5 c4 c6"
    ],
    [
      "C01d",
      "French: Exchange, 4.c4 Nf6",
      "e4 e6 d4 d5 exd5 exd5 c4 Nf6"
    ],
    [
      "C01d",
      "French: Exchange, 4.c4 Nf6",
      "e4 e6 d4 d5 exd5 exd5 c4 Nf6 Nf3"
    ],
    [
      "C01g",
      "French: Exchange, 4.Bf4",
      "e4 e6 d4 d5 exd5 exd5 Bf4"
    ],
    [
      "C01h",
      "French: Exchange, 4.Bd3",
      "e4 e6 d4 d5 exd5 exd5 Bd3"
    ],
    [
      "C01i",
      "French: Exchange, 4.Bd3 Nc6",
      "e4 e6 d4 d5 exd5 exd5 Bd3 Nc6"
    ],
    [
      "C01j",
      "French: Exchange, 4.Bd3 Bd6",
      "e4 e6 d4 d5 exd5 exd5 Bd3 Bd6"
    ],
    [
      "C01k",
      "French: Exchange, 4.Nf3",
      "e4 e6 d4 d5 exd5 exd5 Nf3"
    ],
    [
      "C01l",
      "French: Exchange, 4.Nf3 Nf6",
      "e4 e6 d4 d5 exd5 exd5 Nf3 Nf6"
    ],
    [
      "C01n",
      "French: Exchange, 4.Nf3 Bd6",
      "e4 e6 d4 d5 exd5 exd5 Nf3 Bd6"
    ],
    [
      "C01r",
      "French: Exchange, 4.Nc3",
      "e4 e6 d4 d5 exd5 exd5 Nc3"
    ],
    [
      "C01s",
      "French: Exchange, 4.Nc3 Nf6",
      "e4 e6 d4 d5 exd5 exd5 Nc3 Nf6"
    ],
    [
      "C01u",
      "French: Exchange Winawer",
      "e4 e6 d4 d5 exd5 exd5 Nc3 Bb4"
    ],
    [
      "C02a",
      "French: Advance",
      "e4 e6 d4 d5 e5"
    ],
    [
      "C02a",
      "French: Advance, 3...Ne7",
      "e4 e6 d4 d5 e5 Ne7"
    ],
    [
      "C02b",
      "French: Advance, 3...b6",
      "e4 e6 d4 d5 e5 b6"
    ],
    [
      "C02b",
      "French: Advance, 3...b6",
      "e4 e6 d4 d5 e5 b6 c3 Qd7"
    ],
    [
      "C02c",
      "French: Advance, 3...c5",
      "e4 e6 d4 d5 e5 c5"
    ],
    [
      "C02c",
      "French: Advance, Wing Gambit",
      "e4 e6 d4 d5 e5 c5 b4"
    ],
    [
      "C02d",
      "French: Advance, Steinitz",
      "e4 e6 d4 d5 e5 c5 dxc5"
    ],
    [
      "C02e",
      "French: Advance, Nimzowitsch Attack",
      "e4 e6 d4 d5 e5 c5 Qg4"
    ],
    [
      "C02f",
      "French: Advance, 4.Nf3",
      "e4 e6 d4 d5 e5 c5 Nf3"
    ],
    [
      "C02g",
      "French: Advance, 4.c3",
      "e4 e6 d4 d5 e5 c5 c3"
    ],
    [
      "C02h",
      "French: Advance, 4.c3 Qb6",
      "e4 e6 d4 d5 e5 c5 c3 Qb6"
    ],
    [
      "C02i",
      "French: Advance, Wade",
      "e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7"
    ],
    [
      "C02k",
      "French: Advance, 4...Nc6",
      "e4 e6 d4 d5 e5 c5 c3 Nc6"
    ],
    [
      "C02l",
      "French: Advance, Paulsen",
      "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3"
    ],
    [
      "C02n",
      "French: Advance, Euwe",
      "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7"
    ],
    [
      "C02r",
      "French: Advance, 5.Nf3 Qb6",
      "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6"
    ],
    [
      "C03a",
      "French: Tarrasch",
      "e4 e6 d4 d5 Nd2"
    ],
    [
      "C03a",
      "French: Tarrasch, 3...dxe4",
      "e4 e6 d4 d5 Nd2 dxe4"
    ],
    [
      "C03b",
      "French: Tarrasch, Haberditz Variation",
      "e4 e6 d4 d5 Nd2 f5"
    ],
    [
      "C03c",
      "French: Tarrasch, 3...b6",
      "e4 e6 d4 d5 Nd2 b6"
    ],
    [
      "C03d",
      "French: Tarrasch, 3...a6",
      "e4 e6 d4 d5 Nd2 a6"
    ],
    [
      "C03e",
      "French: Tarrasch, 3...a6 4.Ngf3",
      "e4 e6 d4 d5 Nd2 a6 Ngf3"
    ],
    [
      "C03f",
      "French: Tarrasch, 3...Be7",
      "e4 e6 d4 d5 Nd2 Be7"
    ],
    [
      "C03g",
      "French: Tarrasch, 3...Be7 4.Bd3",
      "e4 e6 d4 d5 Nd2 Be7 Bd3"
    ],
    [
      "C03h",
      "French: Tarrasch, 3...Be7 4.Bd3 c5",
      "e4 e6 d4 d5 Nd2 Be7 Bd3 c5"
    ],
    [
      "C03j",
      "French: Tarrasch, 3...Be7 4.Ngf3",
      "e4 e6 d4 d5 Nd2 Be7 Ngf3"
    ],
    [
      "C03l",
      "French: Tarrasch, Guimard Variation",
      "e4 e6 d4 d5 Nd2 Nc6"
    ],
    [
      "C03m",
      "French: Tarrasch, Guimard, 4.c3",
      "e4 e6 d4 d5 Nd2 Nc6 c3"
    ],
    [
      "C03n",
      "French: Tarrasch, Guimard, 4.c3 e5",
      "e4 e6 d4 d5 Nd2 Nc6 c3 e5"
    ],
    [
      "C03o",
      "French: Tarrasch, Guimard, 4.Ngf3",
      "e4 e6 d4 d5 Nd2 Nc6 Ngf3"
    ],
    [
      "C05a",
      "French: Tarrasch, Closed",
      "e4 e6 d4 d5 Nd2 Nf6"
    ],
    [
      "C05b",
      "French: Tarrasch, Closed, 4.e5",
      "e4 e6 d4 d5 Nd2 Nf6 e5"
    ],
    [
      "C05c",
      "French: Tarrasch, Closed, 4...Ne4",
      "e4 e6 d4 d5 Nd2 Nf6 e5 Ne4"
    ],
    [
      "C07a",
      "French: Tarrasch, Open",
      "e4 e6 d4 d5 Nd2 c5"
    ],
    [
      "C07b",
      "French: Tarrasch, Open, 4.c3",
      "e4 e6 d4 d5 Nd2 c5 c3"
    ],
    [
      "C07c",
      "French: Tarrasch, Open, 4.dxc5",
      "e4 e6 d4 d5 Nd2 c5 dxc5"
    ],
    [
      "C07d",
      "French: Tarrasch, Open, 4.Ngf3",
      "e4 e6 d4 d5 Nd2 c5 Ngf3"
    ],
    [
      "C07e",
      "French: Tarrasch, Open, 4.Ngf3 a6",
      "e4 e6 d4 d5 Nd2 c5 Ngf3 a6"
    ],
    [
      "C07i",
      "French: Tarrasch, Open, 4.exd5",
      "e4 e6 d4 d5 Nd2 c5 exd5"
    ],
    [
      "C10a",
      "French: 3.Nc3",
      "e4 e6 d4 d5 Nc3"
    ],
    [
      "C10b",
      "French: Marshall Variation",
      "e4 e6 d4 d5 Nc3 c5"
    ],
    [
      "C10c",
      "French: 3.Nc3 Nc6",
      "e4 e6 d4 d5 Nc3 Nc6"
    ],
    [
      "C10d",
      "French: 3.Nc3 Nc6 4.Nf3 Nf6",
      "e4 e6 d4 d5 Nc3 Nc6 Nf3 Nf6"
    ],
    [
      "C10e",
      "French: 3.Nc3 Be7",
      "e4 e6 d4 d5 Nc3 Be7"
    ],
    [
      "C10f",
      "French: Rubinstein",
      "e4 e6 d4 d5 Nc3 dxe4"
    ],
    [
      "C10f",
      "French: Rubinstein",
      "e4 e6 d4 d5 Nc3 dxe4 Nxe4"
    ],
    [
      "C10f",
      "French: Rubinstein, Ellis Gambit",
      "e4 e6 d4 d5 Nc3 dxe4 Nxe4 e5"
    ],
    [
      "C10g",
      "French: Rubinstein, 4...Nf6",
      "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nf6"
    ],
    [
      "C10h",
      "French: Rubinstein, 4...Nd7",
      "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7"
    ],
    [
      "C10r",
      "French: Rubinstein, 4...Bd7",
      "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7"
    ],
    [
      "C11a",
      "French: 3.Nc3 Nf6",
      "e4 e6 d4 d5 Nc3 Nf6"
    ],
    [
      "C11a",
      "French: Henneberger Variation",
      "e4 e6 d4 d5 Nc3 Nf6 Be3"
    ],
    [
      "C11a",
      "French: 3.Nc3 Nf6 4.exd5",
      "e4 e6 d4 d5 Nc3 Nf6 exd5"
    ],
    [
      "C11b",
      "French: Swiss Variation",
      "e4 e6 d4 d5 Nc3 Nf6 Bd3"
    ],
    [
      "C11c",
      "French: Steinitz",
      "e4 e6 d4 d5 Nc3 Nf6 e5"
    ],
    [
      "C11d",
      "French: Steinitz, 5.Nf3",
      "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 Nf3"
    ],
    [
      "C11f",
      "French: Steinitz, 5.f4",
      "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4"
    ],
    [
      "C11f",
      "French: Steinitz, 5.f4 c5",
      "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5"
    ],
    [
      "C11o",
      "French: 3.Nc3 Nf6 4.Bg5",
      "e4 e6 d4 d5 Nc3 Nf6 Bg5"
    ],
    [
      "C11o",
      "French: Burn Variation",
      "e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4"
    ],
    [
      "C11p",
      "French: Burn, 5.Nxe4",
      "e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4"
    ],
    [
      "C12a",
      "French: MacCutcheon",
      "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4"
    ],
    [
      "C13a",
      "French: Classical",
      "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7"
    ],
    [
      "C15a",
      "French: Winawer",
      "e4 e6 d4 d5 Nc3 Bb4"
    ],
    [
      "C15b",
      "French: Winawer, 4.exd5",
      "e4 e6 d4 d5 Nc3 Bb4 exd5"
    ],
    [
      "C15b",
      "French: Winawer, 4.exd5 Qxd5",
      "e4 e6 d4 d5 Nc3 Bb4 exd5 Qxd5"
    ],
    [
      "C15c",
      "French: Winawer, 4.Qg4",
      "e4 e6 d4 d5 Nc3 Bb4 Qg4"
    ],
    [
      "C15d",
      "French: Winawer, 4.Qd3",
      "e4 e6 d4 d5 Nc3 Bb4 Qd3"
    ],
    [
      "C15d",
      "French: Winawer, 4.Qd3 dxe4",
      "e4 e6 d4 d5 Nc3 Bb4 Qd3 dxe4"
    ],
    [
      "C15e",
      "French: Winawer, 4.Bd3",
      "e4 e6 d4 d5 Nc3 Bb4 Bd3"
    ],
    [
      "C15f",
      "French: Winawer, 4.Bd3 c5",
      "e4 e6 d4 d5 Nc3 Bb4 Bd3 c5"
    ],
    [
      "C15g",
      "French: Winawer, 4.Bd3 dxe4",
      "e4 e6 d4 d5 Nc3 Bb4 Bd3 dxe4"
    ],
    [
      "C15k",
      "French: Winawer, 4.a3",
      "e4 e6 d4 d5 Nc3 Bb4 a3"
    ],
    [
      "C15k",
      "French: Winawer, 4.a3 Bxc3+",
      "e4 e6 d4 d5 Nc3 Bb4 a3 Bxc3+"
    ],
    [
      "C15n",
      "French: Winawer, Alekhine Gambit",
      "e4 e6 d4 d5 Nc3 Bb4 Ne2"
    ],
    [
      "C16a",
      "French: Winawer, Advance Variation",
      "e4 e6 d4 d5 Nc3 Bb4 e5"
    ],
    [
      "C16b",
      "French: Winawer, 4.e5 b6",
      "e4 e6 d4 d5 Nc3 Bb4 e5 b6"
    ],
    [
      "C16j",
      "French: Winawer, Advance, 4...Ne7",
      "e4 e6 d4 d5 Nc3 Bb4 e5 Ne7"
    ],
    [
      "C17a",
      "French: Winawer, Advance, 4...c5",
      "e4 e6 d4 d5 Nc3 Bb4 e5 c5"
    ],
    [
      "C17k",
      "French: Winawer, 5.a3",
      "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3"
    ],
    [
      "C20",
      "Open Game",
      "e4 e5"
    ],
    [
      "C20",
      "Open Game: Mengarini Opening",
      "e4 e5 a3"
    ],
    [
      "C20",
      "Open Game: Patzer/Parnham Opening",
      "e4 e5 Qh5"
    ],
    [
      "C20",
      "Open Game: Napoleon's Opening",
      "e4 e5 Qf3"
    ],
    [
      "C20",
      "Open Game: 2.d3",
      "e4 e5 d3"
    ],
    [
      "C20",
      "Open Game: 2.d3 d5",
      "e4 e5 d3 d5"
    ],
    [
      "C20",
      "Open Game: 2.c4",
      "e4 e5 c4"
    ],
    [
      "C20",
      "Open Game: Lopez/Mcleod Opening",
      "e4 e5 c3"
    ],
    [
      "C20",
      "Open Game: Lopez/Mcleod, Lasa Gambit",
      "e4 e5 c3 f5"
    ],
    [
      "C20",
      "Open Game: Alapin Opening",
      "e4 e5 Ne2"
    ],
    [
      "C20",
      "Open Game: Alapin Opening",
      "e4 e5 Ne2 Nf6"
    ],
    [
      "C20",
      "Open Game: Portuguese Opening",
      "e4 e5 Bb5"
    ],
    [
      "C20",
      "Open Game: Portuguese, 2...Nf6",
      "e4 e5 Bb5 Nf6"
    ],
    [
      "C20",
      "Open Game: Portuguese Gambit",
      "e4 e5 Bb5 Nf6 d4"
    ],
    [
      "C20",
      "Open Game: Portuguese, 2...Nc6",
      "e4 e5 Bb5 Nc6"
    ],
    [
      "C20",
      "Open Game: Portuguese, 2...c6",
      "e4 e5 Bb5 c6"
    ],
    [
      "C21",
      "Centre Game",
      "e4 e5 d4"
    ],
    [
      "C21",
      "Centre Game: Maroczy Defence",
      "e4 e5 d4 d6"
    ],
    [
      "C21",
      "Centre Game: Maroczy Defence, 3.dxe5",
      "e4 e5 d4 d6 dxe5"
    ],
    [
      "C21",
      "Centre Game: Queenswap line",
      "e4 e5 d4 d6 dxe5 dxe5 Qxd8+"
    ],
    [
      "C21",
      "Centre Game",
      "e4 e5 d4 exd4"
    ],
    [
      "C21",
      "Centre Game: 3.Nf3",
      "e4 e5 d4 exd4 Nf3"
    ],
    [
      "C21",
      "Centre Game: Halasz Gambit",
      "e4 e5 d4 exd4 f4"
    ],
    [
      "C21",
      "Danish Gambit",
      "e4 e5 d4 exd4 c3"
    ],
    [
      "C21",
      "Danish Gambit: Svenonius Defence",
      "e4 e5 d4 exd4 c3 Ne7"
    ],
    [
      "C21",
      "Danish Gambit: S\u00f6rensen Defence",
      "e4 e5 d4 exd4 c3 d5"
    ],
    [
      "C21",
      "Danish Gambit: Accepted",
      "e4 e5 d4 exd4 c3 dxc3"
    ],
    [
      "C21",
      "Danish Gambit: Accepted, 4.Bc4",
      "e4 e5 d4 exd4 c3 dxc3 Bc4"
    ],
    [
      "C22",
      "Centre Game",
      "e4 e5 d4 exd4 Qxd4"
    ],
    [
      "C22",
      "Centre Game",
      "e4 e5 d4 exd4 Qxd4 Nc6"
    ],
    [
      "C22",
      "Centre Game: Hall Variation",
      "e4 e5 d4 exd4 Qxd4 Nc6 Qc4"
    ],
    [
      "C22",
      "Centre Game: Paulsen Attack",
      "e4 e5 d4 exd4 Qxd4 Nc6 Qe3"
    ],
    [
      "C22",
      "Centre Game: Berger Variation",
      "e4 e5 d4 exd4 Qxd4 Nc6 Qe3 Nf6"
    ],
    [
      "C23",
      "Bishop's Opening",
      "e4 e5 Bc4"
    ],
    [
      "C23",
      "Bishop's Opening: Anderssen Gambit",
      "e4 e5 Bc4 b5"
    ],
    [
      "C23",
      "Bishop's Opening: Philidor Counterattack",
      "e4 e5 Bc4 c6"
    ],
    [
      "C23",
      "Bishop's Opening: Calabrese Countergambit",
      "e4 e5 Bc4 f5"
    ],
    [
      "C23",
      "Bishop's Opening: Classical Variation",
      "e4 e5 Bc4 Bc5"
    ],
    [
      "C23",
      "Bishop's Opening: 2...Bc5 3.Qe2",
      "e4 e5 Bc4 Bc5 Qe2"
    ],
    [
      "C23",
      "Bishop's Opening: Lewis Gambit",
      "e4 e5 Bc4 Bc5 d4"
    ],
    [
      "C23",
      "Bishop's Opening: MacDonnell Gambit",
      "e4 e5 Bc4 Bc5 b4"
    ],
    [
      "C23",
      "Bishop's Opening: Philidor Variation",
      "e4 e5 Bc4 Bc5 c3"
    ],
    [
      "C23",
      "Bishop's Opening: del Rio Variation",
      "e4 e5 Bc4 Bc5 c3 Qg5"
    ],
    [
      "C23",
      "Bishop's Opening: Lewis Countergambit",
      "e4 e5 Bc4 Bc5 c3 d5"
    ],
    [
      "C24",
      "Bishop's Opening: Berlin Defence",
      "e4 e5 Bc4 Nf6"
    ],
    [
      "C24",
      "Bishop's Opening: Greco Gambit",
      "e4 e5 Bc4 Nf6 f4"
    ],
    [
      "C24",
      "Bishop's Opening: 3.d3",
      "e4 e5 Bc4 Nf6 d3"
    ],
    [
      "C24",
      "Bishop's Opening: 3.d3 d5",
      "e4 e5 Bc4 Nf6 d3 d5"
    ],
    [
      "C24",
      "Bishop's Opening: Paulsen Defence",
      "e4 e5 Bc4 Nf6 d3 c6"
    ],
    [
      "C24",
      "Bishop's Opening: Paulsen, 4.Nf3",
      "e4 e5 Bc4 Nf6 d3 c6 Nf3"
    ],
    [
      "C24",
      "Bishop's Opening: 3.d4",
      "e4 e5 Bc4 Nf6 d4"
    ],
    [
      "C24",
      "Bishop's Opening: Urusov Gambit",
      "e4 e5 Bc4 Nf6 d4 exd4 Nf3"
    ],
    [
      "C25a",
      "Vienna Game",
      "e4 e5 Nc3"
    ],
    [
      "C25b",
      "Vienna: 2...Bb4",
      "e4 e5 Nc3 Bb4"
    ],
    [
      "C25b",
      "Vienna: Zhuravlev",
      "e4 e5 Nc3 Bb4 Qg4"
    ],
    [
      "C25c",
      "Vienna: 2...d6",
      "e4 e5 Nc3 d6"
    ],
    [
      "C25c",
      "Vienna: 2...d6 3.Bc4",
      "e4 e5 Nc3 d6 Bc4"
    ],
    [
      "C25d",
      "Vienna: 2...Bc5",
      "e4 e5 Nc3 Bc5"
    ],
    [
      "C25d",
      "Vienna: Hammpe-Meitner",
      "e4 e5 Nc3 Bc5 Na4"
    ],
    [
      "C25e",
      "Vienna: 2...Bc5 3.Bc4",
      "e4 e5 Nc3 Bc5 Bc4"
    ],
    [
      "C25f",
      "Vienna: 2...Bc5 3.Nf3",
      "e4 e5 Nc3 Bc5 Nf3"
    ],
    [
      "C25g",
      "Vienna: 2...Nc6",
      "e4 e5 Nc3 Nc6"
    ],
    [
      "C25g",
      "Vienna: Fyfe Gambit",
      "e4 e5 Nc3 Nc6 d4"
    ],
    [
      "C25h",
      "Vienna: Paulsen Variation",
      "e4 e5 Nc3 Nc6 g3"
    ],
    [
      "C25i",
      "Vienna: Paulsen, 3...Bc5",
      "e4 e5 Nc3 Nc6 g3 Bc5"
    ],
    [
      "C25j",
      "Vienna: 2...Nc6 3.Bc4",
      "e4 e5 Nc3 Nc6 Bc4"
    ],
    [
      "C25j",
      "Vienna: 2...Nc6 3.Bc4 Bc5",
      "e4 e5 Nc3 Nc6 Bc4 Bc5"
    ],
    [
      "C25k",
      "Vienna: 2...Nc6 3.Bc4 Bc5 4.d3",
      "e4 e5 Nc3 Nc6 Bc4 Bc5 d3"
    ],
    [
      "C25l",
      "Vienna: 2...Nc6 3.Bc4 Bc5 4.Qg4",
      "e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4"
    ],
    [
      "C25m",
      "Vienna: 2...Nc6 3.f4",
      "e4 e5 Nc3 Nc6 f4"
    ],
    [
      "C25m",
      "Vienna: 2...Nc6 3.f4",
      "e4 e5 Nc3 Nc6 f4 exf4"
    ],
    [
      "C25n",
      "Vienna: Steinitz Gambit",
      "e4 e5 Nc3 Nc6 f4 exf4 d4"
    ],
    [
      "C25p",
      "Vienna: 2...Nc6 3.f4 exf4 4.Nf3",
      "e4 e5 Nc3 Nc6 f4 exf4 Nf3"
    ],
    [
      "C25r",
      "Vienna: Pierce Gambit",
      "e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 d4"
    ],
    [
      "C26a",
      "Vienna: 2...Nf6",
      "e4 e5 Nc3 Nf6"
    ],
    [
      "C26a",
      "Vienna: Mengarini Variation",
      "e4 e5 Nc3 Nf6 a3"
    ],
    [
      "C26b",
      "Vienna: 2...Nf6 3.d3",
      "e4 e5 Nc3 Nf6 d3"
    ],
    [
      "C26c",
      "Vienna: Smyslov Variation",
      "e4 e5 Nc3 Nf6 g3"
    ],
    [
      "C26d",
      "Vienna: Smyslov, 3...Nc6",
      "e4 e5 Nc3 Nf6 g3 Nc6"
    ],
    [
      "C26d",
      "Vienna: Smyslov, 3...Nc6",
      "e4 e5 Nc3 Nf6 g3 Nc6 Bg2"
    ],
    [
      "C26e",
      "Vienna: Smyslov, 3...Bc5",
      "e4 e5 Nc3 Nf6 g3 Bc5"
    ],
    [
      "C26e",
      "Vienna: Smyslov, 3...Bc5",
      "e4 e5 Nc3 Nf6 g3 Bc5 Bg2"
    ],
    [
      "C26i",
      "Vienna: Smyslov, 3...d5",
      "e4 e5 Nc3 Nf6 g3 d5"
    ],
    [
      "C26i",
      "Vienna: Smyslov, 3...d5",
      "e4 e5 Nc3 Nf6 g3 d5 exd5 Nxd5 Bg2"
    ],
    [
      "C26l",
      "Vienna: 3.Bc4",
      "e4 e5 Nc3 Nf6 Bc4"
    ],
    [
      "C26l",
      "Vienna: Horwitz Gambit",
      "e4 e5 Nc3 Nf6 Bc4 b5"
    ],
    [
      "C26m",
      "Vienna: 3.Bc4 Bb4",
      "e4 e5 Nc3 Nf6 Bc4 Bb4"
    ],
    [
      "C26n",
      "Vienna: 3.Bc4 Bb4 4.Nf3",
      "e4 e5 Nc3 Nf6 Bc4 Bb4 Nf3"
    ],
    [
      "C26o",
      "Vienna: 3.Bc4 Bb4 4.Nf3 O-O",
      "e4 e5 Nc3 Nf6 Bc4 Bb4 Nf3 O-O"
    ],
    [
      "C26p",
      "Vienna: 3.Bc4 Bc5",
      "e4 e5 Nc3 Nf6 Bc4 Bc5"
    ],
    [
      "C26p",
      "Vienna: 3.Bc4 Bc5 4.f4",
      "e4 e5 Nc3 Nf6 Bc4 Bc5 f4"
    ],
    [
      "C26q",
      "Vienna: 3.Bc4 Bc5 4.Nf3",
      "e4 e5 Nc3 Nf6 Bc4 Bc5 Nf3"
    ],
    [
      "C26r",
      "Vienna: 3.Bc4 Bc5 4.d3",
      "e4 e5 Nc3 Nf6 Bc4 Bc5 d3"
    ],
    [
      "C26s",
      "Vienna: 3.Bc4 Bc5 4.d3 d6",
      "e4 e5 Nc3 Nf6 Bc4 Bc5 d3 d6"
    ],
    [
      "C27a",
      "Vienna: 3.Bc4 Nxe4",
      "e4 e5 Nc3 Nf6 Bc4 Nxe4"
    ],
    [
      "C27b",
      "Vienna: 3.Bc4 Nxe4 4.Nxe4",
      "e4 e5 Nc3 Nf6 Bc4 Nxe4 Nxe4"
    ],
    [
      "C27c",
      "Vienna: 3.Bc4 Nxe4 4.Qh5",
      "e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5"
    ],
    [
      "C28a",
      "Vienna: 3.Bc4 Nc6",
      "e4 e5 Nc3 Nf6 Bc4 Nc6"
    ],
    [
      "C28b",
      "Vienna: 3.Bc4 Nc6 4.f4",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 f4"
    ],
    [
      "C28b",
      "Vienna: Bronstein Gambit",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 f4 Nxe4 Nf3"
    ],
    [
      "C28c",
      "Vienna: 3.Bc4 Nc6 4.d3",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 d3"
    ],
    [
      "C28d",
      "Vienna: 3.Bc4 Nc6 4.d3 Be7",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 d3 Be7"
    ],
    [
      "C28e",
      "Vienna: 3.Bc4 Nc6 4.d3 Na5",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 d3 Na5"
    ],
    [
      "C28g",
      "Vienna: 3.Bc4 Nc6 4.d3 Bc5",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 d3 Bc5"
    ],
    [
      "C28m",
      "Vienna: 3.Bc4 Nc6 4.d3 Bb4",
      "e4 e5 Nc3 Nf6 Bc4 Nc6 d3 Bb4"
    ],
    [
      "C29a",
      "Vienna Gambit",
      "e4 e5 Nc3 Nf6 f4"
    ],
    [
      "C29a",
      "Vienna Gambit: 3...exf4",
      "e4 e5 Nc3 Nf6 f4 exf4"
    ],
    [
      "C29b",
      "Vienna Gambit: 3...d6",
      "e4 e5 Nc3 Nf6 f4 d6"
    ],
    [
      "C29b",
      "Vienna Gambit: 3...d6 4.Nf3",
      "e4 e5 Nc3 Nf6 f4 d6 Nf3"
    ],
    [
      "C29c",
      "Vienna Gambit: 3...d5",
      "e4 e5 Nc3 Nf6 f4 d5"
    ],
    [
      "C29d",
      "Vienna Gambit: 3...d5 4.exd5",
      "e4 e5 Nc3 Nf6 f4 d5 exd5"
    ],
    [
      "C29e",
      "Vienna Gambit: Steinitz Variation",
      "e4 e5 Nc3 Nf6 f4 d5 d3"
    ],
    [
      "C29f",
      "Vienna Gambit: 4.fxe5",
      "e4 e5 Nc3 Nf6 f4 d5 fxe5"
    ],
    [
      "C29f",
      "Vienna Gambit: 4.fxe5",
      "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4"
    ],
    [
      "C29n",
      "Vienna Gambit: 5.Nf3",
      "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3"
    ],
    [
      "C30a",
      "King's Gambit",
      "e4 e5 f4"
    ],
    [
      "C30b",
      "King's Gambit: Mafia Defence",
      "e4 e5 f4 c5"
    ],
    [
      "C30c",
      "King's Gambit: 2...d6",
      "e4 e5 f4 d6"
    ],
    [
      "C30c",
      "King's Gambit: 2...d6 3.Nf3",
      "e4 e5 f4 d6 Nf3"
    ],
    [
      "C30c",
      "King's Gambit: 2...d6 3.Nf3 Nc6",
      "e4 e5 f4 d6 Nf3 Nc6"
    ],
    [
      "C30d",
      "King's Gambit: Wade Variation",
      "e4 e5 f4 Nf6"
    ],
    [
      "C30e",
      "King's Gambit: Norwald Variation",
      "e4 e5 f4 Qf6"
    ],
    [
      "C30f",
      "King's Gambit: Keene Defence",
      "e4 e5 f4 Qh4+"
    ],
    [
      "C30f",
      "King's Gambit: Keene Defence, 3.g3 Qe7",
      "e4 e5 f4 Qh4+ g3 Qe7"
    ],
    [
      "C30g",
      "King's Gambit: 2...Nc6",
      "e4 e5 f4 Nc6"
    ],
    [
      "C30h",
      "King's Gambit: Adelaide-Wahls Variation",
      "e4 e5 f4 Nc6 Nf3 f5"
    ],
    [
      "C30j",
      "King's Gambit: Classical KGD",
      "e4 e5 f4 Bc5"
    ],
    [
      "C30j",
      "KGD: Classical, 3.Bc4",
      "e4 e5 f4 Bc5 Bc4"
    ],
    [
      "C30j",
      "KGD: Classical, 3.Nf3",
      "e4 e5 f4 Bc5 Nf3"
    ],
    [
      "C30j",
      "KGD: Classical, Senechaud Countergambit",
      "e4 e5 f4 Bc5 Nf3 g5"
    ],
    [
      "C30k",
      "KGD: Classical, 3.Nf3 d6",
      "e4 e5 f4 Bc5 Nf3 d6"
    ],
    [
      "C30k",
      "KGD: Classical, Heath Variation",
      "e4 e5 f4 Bc5 Nf3 d6 b4"
    ],
    [
      "C30l",
      "KGD: Classical, 3.Nf3 d6 4.Nc3",
      "e4 e5 f4 Bc5 Nf3 d6 Nc3"
    ],
    [
      "C30l",
      "KGD: Classical, Hanham Variation",
      "e4 e5 f4 Bc5 Nf3 d6 Nc3 Nd7"
    ],
    [
      "C30n",
      "KGD: Classical, 4.c3",
      "e4 e5 f4 Bc5 Nf3 d6 c3"
    ],
    [
      "C30o",
      "KGD: Classical, 4.c3 Bb6",
      "e4 e5 f4 Bc5 Nf3 d6 c3 Bb6"
    ],
    [
      "C30p",
      "KGD: Classical, 4.c3 Nf6",
      "e4 e5 f4 Bc5 Nf3 d6 c3 Nf6"
    ],
    [
      "C30q",
      "KGD: Classical, 4.c3 Nf6 5.d4",
      "e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4"
    ],
    [
      "C30r",
      "KGD: Classical Countergambit",
      "e4 e5 f4 Bc5 Nf3 d6 c3 f5"
    ],
    [
      "C31",
      "KGD: Falkbeer Countergambit",
      "e4 e5 f4 d5"
    ],
    [
      "C31",
      "KGD: Falkbeer, Tartakower Variation",
      "e4 e5 f4 d5 Nf3"
    ],
    [
      "C31",
      "KGD: Falkbeer, Milner-Barry Variation",
      "e4 e5 f4 d5 Nc3"
    ],
    [
      "C31",
      "KGD: Falkbeer, 3.exd5",
      "e4 e5 f4 d5 exd5"
    ],
    [
      "C31",
      "KGD: Falkbeer, 3.exd5 exf4",
      "e4 e5 f4 d5 exd5 exf4"
    ],
    [
      "C31",
      "KGD: Falkbeer, 3.exd5 e4",
      "e4 e5 f4 d5 exd5 e4"
    ],
    [
      "C31",
      "KGD: Falkbeer, Nimzowitsch Variation",
      "e4 e5 f4 d5 exd5 e4 Bb5+"
    ],
    [
      "C31",
      "KGD: Falkbeer, 4.d3",
      "e4 e5 f4 d5 exd5 e4 d3"
    ],
    [
      "C32",
      "KGD: Falkbeer, 4.d3 Nf6",
      "e4 e5 f4 d5 exd5 e4 d3 Nf6"
    ],
    [
      "C32",
      "KGD: Falkbeer, 5.dxe4",
      "e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4"
    ],
    [
      "C33",
      "King's Gambit Accepted (KGA)",
      "e4 e5 f4 exf4"
    ],
    [
      "C33",
      "KGA: Tumbleweed/Drunken King",
      "e4 e5 f4 exf4 Kf2"
    ],
    [
      "C33",
      "KGA: Orsini Gambit",
      "e4 e5 f4 exf4 b3"
    ],
    [
      "C33",
      "KGA: Stamma (Leonardo) Gambit",
      "e4 e5 f4 exf4 h4"
    ],
    [
      "C33",
      "KGA: Schurig Gambit",
      "e4 e5 f4 exf4 Bd3"
    ],
    [
      "C33",
      "KGA: Basman Gambit",
      "e4 e5 f4 exf4 Qe2"
    ],
    [
      "C33",
      "KGA: Carrera Gambit",
      "e4 e5 f4 exf4 Qh5"
    ],
    [
      "C33",
      "KGA: Eisenberg Gambit",
      "e4 e5 f4 exf4 Nh3"
    ],
    [
      "C33",
      "KGA: Eisenberg Gambit",
      "e4 e5 f4 exf4 Ne2"
    ],
    [
      "C33",
      "KGA: Villemson Gambit",
      "e4 e5 f4 exf4 d4"
    ],
    [
      "C33",
      "KGA: Keres Gambit",
      "e4 e5 f4 exf4 Nc3"
    ],
    [
      "C33",
      "KGA: Breyer Gambit",
      "e4 e5 f4 exf4 Qf3"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit",
      "e4 e5 f4 exf4 Bc4"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Steinitz Defence",
      "e4 e5 f4 exf4 Bc4 Ne7"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Maurian Defence",
      "e4 e5 f4 exf4 Bc4 Nc6"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Ruy Lopez Defence",
      "e4 e5 f4 exf4 Bc4 c6"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Bledow Variation",
      "e4 e5 f4 exf4 Bc4 d5"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Bledow, 4.exd5",
      "e4 e5 f4 exf4 Bc4 d5 exd5"
    ],
    [
      "C33",
      "KGA: Bishop's Gambit, Bledow, 4.Bxd5",
      "e4 e5 f4 exf4 Bc4 d5 Bxd5"
    ],
    [
      "C34",
      "KGA: King's Knight Gambit",
      "e4 e5 f4 exf4 Nf3"
    ],
    [
      "C34",
      "KGA: Bonsch-Osmolovsky Variation",
      "e4 e5 f4 exf4 Nf3 Ne7"
    ],
    [
      "C34",
      "KGA: Gianutio Countergambit",
      "e4 e5 f4 exf4 Nf3 f5"
    ],
    [
      "C34",
      "KGA: Schallop Defence",
      "e4 e5 f4 exf4 Nf3 Nf6"
    ],
    [
      "C34",
      "KGA: Fischer Defence",
      "e4 e5 f4 exf4 Nf3 d6"
    ],
    [
      "C34",
      "KGA: Fischer, 4.Bc4",
      "e4 e5 f4 exf4 Nf3 d6 Bc4"
    ],
    [
      "C34",
      "KGA: Fischer, 4.d4",
      "e4 e5 f4 exf4 Nf3 d6 d4"
    ],
    [
      "C35",
      "KGA: Cunningham Defence",
      "e4 e5 f4 exf4 Nf3 Be7"
    ],
    [
      "C35",
      "KGA: Cunningham, Euwe Defence",
      "e4 e5 f4 exf4 Nf3 Be7 Bc4 Nf6"
    ],
    [
      "C36",
      "KGA: Scandinavian, 4.exd5",
      "e4 e5 f4 exf4 Nf3 d5 exd5"
    ],
    [
      "C36",
      "KGA: Scandinavian, 4.exd5 Bd6",
      "e4 e5 f4 exf4 Nf3 d5 exd5 Bd6"
    ],
    [
      "C37",
      "KGA: 3.Nf3 g5",
      "e4 e5 f4 exf4 Nf3 g5"
    ],
    [
      "C37",
      "KGA: Quaade Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Nc3"
    ],
    [
      "C37",
      "KGA: Rosentreter Gambit",
      "e4 e5 f4 exf4 Nf3 g5 d4"
    ],
    [
      "C37",
      "KGA: S\u00f6rensen Gambit",
      "e4 e5 f4 exf4 Nf3 g5 d4 g4 Ne5"
    ],
    [
      "C37",
      "KGA: 3.Nf3 g5 4.Bc4",
      "e4 e5 f4 exf4 Nf3 g5 Bc4"
    ],
    [
      "C37",
      "KGA: Blachly Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 Nc6"
    ],
    [
      "C37",
      "KGA: 3.Nf3 g5 4.Bc4 g4",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 g4"
    ],
    [
      "C37",
      "KGA: Ghulam-Kassim Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 g4 d4"
    ],
    [
      "C37",
      "KGA: MacDonnell Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Nc3"
    ],
    [
      "C37",
      "KGA: Salvio Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5"
    ],
    [
      "C37",
      "KGA: Muzio Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O"
    ],
    [
      "C38",
      "KGA: Philidor Gambit",
      "e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7 h4"
    ],
    [
      "C39",
      "KGA: 3.Nf3 g5 4.h4",
      "e4 e5 f4 exf4 Nf3 g5 h4"
    ],
    [
      "C39",
      "KGA: Allgaier Gambit",
      "e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5"
    ],
    [
      "C40a",
      "Open Game",
      "e4 e5 Nf3"
    ],
    [
      "C40a",
      "Open Game: Damiano Defence",
      "e4 e5 Nf3 f6"
    ],
    [
      "C40b",
      "Open Game: Greco Defence",
      "e4 e5 Nf3 Qf6"
    ],
    [
      "C40c",
      "Open Game: Gunderam Defence",
      "e4 e5 Nf3 Qe7"
    ],
    [
      "C40d",
      "Open Game: Gunderam Defence, 3.Nc3",
      "e4 e5 Nf3 Qe7 Nc3"
    ],
    [
      "C40e",
      "Elephant Gambit",
      "e4 e5 Nf3 d5"
    ],
    [
      "C40f",
      "Elephant Gambit: 3.Nxe5",
      "e4 e5 Nf3 d5 Nxe5"
    ],
    [
      "C40f",
      "Elephant Gambit: 3.Nxe5 dxe4 4.Bc4",
      "e4 e5 Nf3 d5 Nxe5 dxe4 Bc4"
    ],
    [
      "C40g",
      "Elephant Gambit: 3.exd5",
      "e4 e5 Nf3 d5 exd5"
    ],
    [
      "C40h",
      "Elephant Gambit: Maroczy",
      "e4 e5 Nf3 d5 exd5 Bd6"
    ],
    [
      "C40i",
      "Elephant Gambit: Paulsen",
      "e4 e5 Nf3 d5 exd5 e4"
    ],
    [
      "C40j",
      "Latvian Gambit",
      "e4 e5 Nf3 f5"
    ],
    [
      "C40k",
      "Latvian Gambit: 3.d3",
      "e4 e5 Nf3 f5 d3"
    ],
    [
      "C40l",
      "Latvian Gambit: 3.Nc3",
      "e4 e5 Nf3 f5 Nc3"
    ],
    [
      "C40m",
      "Latvian Gambit: 3.d4",
      "e4 e5 Nf3 f5 d4"
    ],
    [
      "C40n",
      "Latvian Gambit: 3.exf5",
      "e4 e5 Nf3 f5 exf5"
    ],
    [
      "C40n",
      "Latvian Gambit: 3.exf5 e4",
      "e4 e5 Nf3 f5 exf5 e4"
    ],
    [
      "C40o",
      "Latvian Gambit: 3.Bc4",
      "e4 e5 Nf3 f5 Bc4"
    ],
    [
      "C40o",
      "Latvian Gambit: Strautins Variation",
      "e4 e5 Nf3 f5 Bc4 b5"
    ],
    [
      "C40o",
      "Latvian Gambit: Morgado Variation",
      "e4 e5 Nf3 f5 Bc4 Nf6"
    ],
    [
      "C40p",
      "Latvian Gambit: 3.Bc4 fxe4",
      "e4 e5 Nf3 f5 Bc4 fxe4"
    ],
    [
      "C40r",
      "Latvian Gambit: 3.Nxe5",
      "e4 e5 Nf3 f5 Nxe5"
    ],
    [
      "C40s",
      "Latvian Gambit: 3.Nxe5 Nc6",
      "e4 e5 Nf3 f5 Nxe5 Nc6"
    ],
    [
      "C40t",
      "Latvian Gambit: 3.Nxe5 Qf6",
      "e4 e5 Nf3 f5 Nxe5 Qf6"
    ],
    [
      "C40t",
      "Latvian Gambit: 3.Nxe5 Qf6 4.Nc4",
      "e4 e5 Nf3 f5 Nxe5 Qf6 Nc4"
    ],
    [
      "C40u",
      "Latvian Gambit: 3.Nxe5 Qf6 4.d4",
      "e4 e5 Nf3 f5 Nxe5 Qf6 d4"
    ],
    [
      "C41a",
      "Philidor Defence",
      "e4 e5 Nf3 d6"
    ],
    [
      "C41b",
      "Philidor: 3.Bc4",
      "e4 e5 Nf3 d6 Bc4"
    ],
    [
      "C41b",
      "Philidor: Steinitz Variation",
      "e4 e5 Nf3 d6 Bc4 Be7 c3"
    ],
    [
      "C41b",
      "Philidor: Lopez Countergambit",
      "e4 e5 Nf3 d6 Bc4 f5"
    ],
    [
      "C41c",
      "Philidor: 3.d4",
      "e4 e5 Nf3 d6 d4"
    ],
    [
      "C41d",
      "Philidor: Philidor Countergambit",
      "e4 e5 Nf3 d6 d4 f5"
    ],
    [
      "C41f",
      "Philidor: Hanham Variation",
      "e4 e5 Nf3 d6 d4 Nd7"
    ],
    [
      "C41f",
      "Philidor: Hanham, 4.Bc4",
      "e4 e5 Nf3 d6 d4 Nd7 Bc4"
    ],
    [
      "C41g",
      "Philidor: Hanham, 4.Bc4 c6",
      "e4 e5 Nf3 d6 d4 Nd7 Bc4 c6"
    ],
    [
      "C41h",
      "Philidor: 3...exd4",
      "e4 e5 Nf3 d6 d4 exd4"
    ],
    [
      "C41h",
      "Philidor: Bird Gambit",
      "e4 e5 Nf3 d6 d4 exd4 c3"
    ],
    [
      "C41i",
      "Philidor: Morphy Variation",
      "e4 e5 Nf3 d6 d4 exd4 Qxd4"
    ],
    [
      "C41i",
      "Philidor: Morphy, 4...Nc6",
      "e4 e5 Nf3 d6 d4 exd4 Qxd4 Nc6"
    ],
    [
      "C41i",
      "Philidor: Morphy, 4...Nf6",
      "e4 e5 Nf3 d6 d4 exd4 Qxd4 Nf6"
    ],
    [
      "C41j",
      "Philidor: 3...exd4 4.Nxd4",
      "e4 e5 Nf3 d6 d4 exd4 Nxd4"
    ],
    [
      "C41j",
      "Philidor: Paulsen Attack",
      "e4 e5 Nf3 d6 d4 exd4 Nxd4 d5 exd5"
    ],
    [
      "C41k",
      "Philidor: 3...exd4 4.Nxd4 Nf6",
      "e4 e5 Nf3 d6 d4 exd4 Nxd4 Nf6"
    ],
    [
      "C41n",
      "Philidor: Larsen Variation",
      "e4 e5 Nf3 d6 d4 exd4 Nxd4 g6"
    ],
    [
      "C41o",
      "Philidor: Nimzowitsch Variation",
      "e4 e5 Nf3 d6 d4 Nf6"
    ],
    [
      "C41p",
      "Philidor: Exchange Variation",
      "e4 e5 Nf3 d6 d4 Nf6 dxe5"
    ],
    [
      "C41q",
      "Philidor: Nimzowitsch Variation",
      "e4 e5 Nf3 d6 d4 Nf6 Nc3"
    ],
    [
      "C41r",
      "Philidor: Improved Hanham",
      "e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7"
    ],
    [
      "C42a",
      "Russian Game (Petroff Defence)",
      "e4 e5 Nf3 Nf6"
    ],
    [
      "C42b",
      "Russian Game: 3.d3",
      "e4 e5 Nf3 Nf6 d3"
    ],
    [
      "C42c",
      "Russian-Three Knights Game",
      "e4 e5 Nf3 Nf6 Nc3"
    ],
    [
      "C42c",
      "Russian-Three Knights Game",
      "e4 e5 Nf3 Nf6 Nc3 Bb4"
    ],
    [
      "C42d",
      "Russian-Three Knights Game, 4.Nxe5",
      "e4 e5 Nf3 Nf6 Nc3 Bb4 Nxe5"
    ],
    [
      "C42e",
      "Russian Game: Italian Variation",
      "e4 e5 Nf3 Nf6 Bc4"
    ],
    [
      "C42g",
      "Russian Game: 3.Nxe5",
      "e4 e5 Nf3 Nf6 Nxe5"
    ],
    [
      "C42g",
      "Russian Game: Damiano Variation",
      "e4 e5 Nf3 Nf6 Nxe5 Nxe4"
    ],
    [
      "C42g",
      "Russian Game: 3.Nxe5 d6",
      "e4 e5 Nf3 Nf6 Nxe5 d6"
    ],
    [
      "C42h",
      "Russian Game: Cochrane Gambit",
      "e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7"
    ],
    [
      "C42i",
      "Russian Game: Paulsen Attack",
      "e4 e5 Nf3 Nf6 Nxe5 d6 Nc4"
    ],
    [
      "C42j",
      "Russian Game: 3.Nxe5 d6 4.Nf3",
      "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3"
    ],
    [
      "C42p",
      "Russian Game: Classical",
      "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4"
    ],
    [
      "C43a",
      "Russian Game: Modern (Steinitz) Attack",
      "e4 e5 Nf3 Nf6 d4"
    ],
    [
      "C43b",
      "Russian Game: Modern Attack",
      "e4 e5 Nf3 Nf6 d4 exd4"
    ],
    [
      "C43c",
      "Russian Game: Modern Attack",
      "e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4"
    ],
    [
      "C44a",
      "Open Game",
      "e4 e5 Nf3 Nc6"
    ],
    [
      "C44a",
      "Open Game: Irish (Chicago) Gambit",
      "e4 e5 Nf3 Nc6 Nxe5"
    ],
    [
      "C44a",
      "Open Game: Paschman Wing Gambit",
      "e4 e5 Nf3 Nc6 b4"
    ],
    [
      "C44a",
      "Open Game: Dresden Opening",
      "e4 e5 Nf3 Nc6 c4"
    ],
    [
      "C44b",
      "Open Game: Konstantinopolsky",
      "e4 e5 Nf3 Nc6 g3"
    ],
    [
      "C44c",
      "Open Game: Inverted Hungarian",
      "e4 e5 Nf3 Nc6 Be2"
    ],
    [
      "C44c",
      "Open Game: Tayler Opening",
      "e4 e5 Nf3 Nc6 Be2 Nf6 d4"
    ],
    [
      "C44d",
      "Open Game: Inverted Philidor",
      "e4 e5 Nf3 Nc6 d3"
    ],
    [
      "C44d",
      "Open Game: Inverted Philidor",
      "e4 e5 Nf3 Nc6 d3 d5"
    ],
    [
      "C44e",
      "Open Game: Inverted Philidor",
      "e4 e5 Nf3 Nc6 d3 Nf6"
    ],
    [
      "C44f",
      "Open Game: Inverted Philidor, 4.g3",
      "e4 e5 Nf3 Nc6 d3 Nf6 g3"
    ],
    [
      "C44g",
      "Open Game: Inverted Philidor, 4.Be2",
      "e4 e5 Nf3 Nc6 d3 Nf6 Be2"
    ],
    [
      "C44h",
      "Open Game: Inverted Hanham",
      "e4 e5 Nf3 Nc6 Be2 Nf6 d3 d5 Nbd2"
    ],
    [
      "C44i",
      "Ponziani Opening",
      "e4 e5 Nf3 Nc6 c3"
    ],
    [
      "C44i",
      "Ponziani: Reti Variation",
      "e4 e5 Nf3 Nc6 c3 Nge7"
    ],
    [
      "C44i",
      "Ponziani: Romanishin Variation",
      "e4 e5 Nf3 Nc6 c3 Be7"
    ],
    [
      "C44j",
      "Ponziani Countergambit",
      "e4 e5 Nf3 Nc6 c3 f5"
    ],
    [
      "C44k",
      "Ponziani: 3...d5",
      "e4 e5 Nf3 Nc6 c3 d5"
    ],
    [
      "C44l",
      "Ponziani: 3...d5 4.Qa4",
      "e4 e5 Nf3 Nc6 c3 d5 Qa4"
    ],
    [
      "C44l",
      "Ponziani: Caro Variation",
      "e4 e5 Nf3 Nc6 c3 d5 Qa4 Bd7"
    ],
    [
      "C44l",
      "Ponziani: Leonhardt Variation",
      "e4 e5 Nf3 Nc6 c3 d5 Qa4 Nf6"
    ],
    [
      "C44m",
      "Ponziani: Steinitz Variation",
      "e4 e5 Nf3 Nc6 c3 d5 Qa4 f6"
    ],
    [
      "C44n",
      "Ponziani: 3...Nf6",
      "e4 e5 Nf3 Nc6 c3 Nf6"
    ],
    [
      "C44n",
      "Ponziani: 3...Nf6",
      "e4 e5 Nf3 Nc6 c3 Nf6 d4"
    ],
    [
      "C44o",
      "Ponziani: 3...Nf6 4.d4 exd4",
      "e4 e5 Nf3 Nc6 c3 Nf6 d4 exd4"
    ],
    [
      "C44p",
      "Ponziani: 3...Nf6 4.d4 Nxe4",
      "e4 e5 Nf3 Nc6 c3 Nf6 d4 Nxe4"
    ],
    [
      "C44r",
      "Scotch Opening",
      "e4 e5 Nf3 Nc6 d4"
    ],
    [
      "C44r",
      "Scotch: Lolli Variation",
      "e4 e5 Nf3 Nc6 d4 Nxd4"
    ],
    [
      "C44s",
      "Scotch: 3...d6",
      "e4 e5 Nf3 Nc6 d4 d6"
    ],
    [
      "C44t",
      "Scotch: 3...exd4",
      "e4 e5 Nf3 Nc6 d4 exd4"
    ],
    [
      "C44t",
      "Scotch: Relfsson Gambit",
      "e4 e5 Nf3 Nc6 d4 exd4 Bb5"
    ],
    [
      "C44t",
      "Scotch: Goring Gambit",
      "e4 e5 Nf3 Nc6 d4 exd4 c3"
    ],
    [
      "C44u",
      "Scotch: Goring Gambit, 4...d5",
      "e4 e5 Nf3 Nc6 d4 exd4 c3 d5"
    ],
    [
      "C44v",
      "Scotch: Goring Gambit, 4...d3",
      "e4 e5 Nf3 Nc6 d4 exd4 c3 d3"
    ],
    [
      "C44x",
      "Scotch Gambit",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4"
    ],
    [
      "C44x",
      "Scotch Gambit: London Defence",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bb4+"
    ],
    [
      "C44y",
      "Scotch Gambit: 4...Bc5",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5"
    ],
    [
      "C44y",
      "Scotch Gambit: 5.Ng5",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 Ng5"
    ],
    [
      "C44y",
      "Scotch Gambit: 5.O-O",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 O-O"
    ],
    [
      "C44z",
      "Scotch Gambit: 5.c3",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3"
    ],
    [
      "C44z",
      "Scotch Gambit: 5.c3 d3",
      "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 d3"
    ],
    [
      "C45a",
      "Scotch: 4.Nxd4",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4"
    ],
    [
      "C45b",
      "Scotch: 4.Nxd4 Nxd4",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4"
    ],
    [
      "C45c",
      "Scotch: 4.Nxd4 Bb4+",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bb4+"
    ],
    [
      "C45d",
      "Scotch: 4.Nxd4 Qf6",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qf6"
    ],
    [
      "C45e",
      "Scotch: Steinitz Variation",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4"
    ],
    [
      "C45e",
      "Scotch: Steinitz, 5.Qd3",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Qd3"
    ],
    [
      "C45f",
      "Scotch: Steinitz, 5.Nc3",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3"
    ],
    [
      "C45g",
      "Scotch: Steinitz, 5.Nb5",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5"
    ],
    [
      "C45h",
      "Scotch: 4.Nxd4 Nf6",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6"
    ],
    [
      "C45n",
      "Scotch: 4.Nxd4 Bc5",
      "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5"
    ],
    [
      "C46a",
      "Three Knights Game",
      "e4 e5 Nf3 Nc6 Nc3"
    ],
    [
      "C46b",
      "Three Knights: Winawer Defence",
      "e4 e5 Nf3 Nc6 Nc3 f5"
    ],
    [
      "C46c",
      "Three Knights: 3...d6",
      "e4 e5 Nf3 Nc6 Nc3 d6"
    ],
    [
      "C46d",
      "Three Knights: 3...d6 4.d4",
      "e4 e5 Nf3 Nc6 Nc3 d6 d4"
    ],
    [
      "C46e",
      "Three Knights: 3...Bc5",
      "e4 e5 Nf3 Nc6 Nc3 Bc5"
    ],
    [
      "C46e",
      "Three Knights: 3...Bc5 4.Bb5",
      "e4 e5 Nf3 Nc6 Nc3 Bc5 Bb5"
    ],
    [
      "C46f",
      "Three Knights: 3...Bc5 4.Nxe5",
      "e4 e5 Nf3 Nc6 Nc3 Bc5 Nxe5"
    ],
    [
      "C46g",
      "Three Knights: 3...Bb4",
      "e4 e5 Nf3 Nc6 Nc3 Bb4"
    ],
    [
      "C46h",
      "Three Knights: 3...Bb4 4.Nd5",
      "e4 e5 Nf3 Nc6 Nc3 Bb4 Nd5"
    ],
    [
      "C46i",
      "Three Knights: Steinitz Variation",
      "e4 e5 Nf3 Nc6 Nc3 g6"
    ],
    [
      "C46j",
      "Three Knights: Steinitz, 4.d4",
      "e4 e5 Nf3 Nc6 Nc3 g6 d4"
    ],
    [
      "C47a",
      "Four Knights Game",
      "e4 e5 Nf3 Nc6 Nc3 Nf6"
    ],
    [
      "C47a",
      "Four Knights: Halloween Gambit",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5"
    ],
    [
      "C47b",
      "Four Knights: Gunsberg Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 a3"
    ],
    [
      "C47c",
      "Four Knights: Van der Wiel Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Be2"
    ],
    [
      "C47d",
      "Four Knights: Italian Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Bc4"
    ],
    [
      "C47e",
      "Four Knights: Glek Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 g3"
    ],
    [
      "C47f",
      "Four Knights: Glek, 4...d5",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 g3 d5"
    ],
    [
      "C47g",
      "Four Knights: Glek, 4...Bc5",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 g3 Bc5"
    ],
    [
      "C47i",
      "Four Knights: Scotch Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 d4"
    ],
    [
      "C47i",
      "Four Knights: Scotch, 4...d6",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 d4 d6"
    ],
    [
      "C47l",
      "Four Knights: Scotch, 4...exd4",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4"
    ],
    [
      "C48a",
      "Four Knights: Spanish Variation",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5"
    ],
    [
      "C48b",
      "Four Knights: Spanish, 4...d6",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 d6"
    ],
    [
      "C49a",
      "Four Knights: 4.Bb5 Bb4",
      "e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4"
    ],
    [
      "C50a",
      "Italian Game",
      "e4 e5 Nf3 Nc6 Bc4"
    ],
    [
      "C50b",
      "Italian: Rousseau Gambit",
      "e4 e5 Nf3 Nc6 Bc4 f5"
    ],
    [
      "C50c",
      "Italian: Blackburne-Shilling Gambit",
      "e4 e5 Nf3 Nc6 Bc4 Nd4"
    ],
    [
      "C50d",
      "Italian: 3...d6",
      "e4 e5 Nf3 Nc6 Bc4 d6"
    ],
    [
      "C50e",
      "Italian: Hungarian Defence",
      "e4 e5 Nf3 Nc6 Bc4 Be7"
    ],
    [
      "C50h",
      "Giuoco Piano",
      "e4 e5 Nf3 Nc6 Bc4 Bc5"
    ],
    [
      "C50h",
      "Giuoco Piano: Jerome Gambit",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 Bxf7+"
    ],
    [
      "C50h",
      "Giuoco Piano: Rosentreter Gambit",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 d4"
    ],
    [
      "C50k",
      "Giuoco Piano: 4.O-O",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 O-O"
    ],
    [
      "C50l",
      "Giuoco Piano: 4.O-O Nf6",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6"
    ],
    [
      "C50n",
      "Giuoco Pianissimo: 4.d3",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 d3"
    ],
    [
      "C50o",
      "Giuoco Pianissimo: 4.d3 Nf6",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6"
    ],
    [
      "C51",
      "Evans Gambit",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 b4"
    ],
    [
      "C51",
      "Evans Gambit Declined: 4...Be7",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Be7"
    ],
    [
      "C51",
      "Evans Gambit: Hein Countergambit",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 d5"
    ],
    [
      "C51",
      "Evans Gambit Accepted",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4"
    ],
    [
      "C53",
      "Giuoco Piano: 4.c3",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3"
    ],
    [
      "C53",
      "Giuoco Piano: Close Variation",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7"
    ],
    [
      "C54a",
      "Giuoco Piano: 4.c3 Nf6",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6"
    ],
    [
      "C54b",
      "Giuoco Piano: Albin Gambit",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 O-O"
    ],
    [
      "C54c",
      "Giuoco Piano: Bird's Attack",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 b4"
    ],
    [
      "C54d",
      "Giuoco Pianissimo: 5.d3",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3"
    ],
    [
      "C54j",
      "Giuoco Piano: 5.d4",
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4"
    ],
    [
      "C55a",
      "Two Knights Defence",
      "e4 e5 Nf3 Nc6 Bc4 Nf6"
    ],
    [
      "C55c",
      "Two Knights: 4.d3",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d3"
    ],
    [
      "C55d",
      "Two Knights: 4.d3 h6",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d3 h6"
    ],
    [
      "C55e",
      "Two Knights: 4.d3 Be7",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7"
    ],
    [
      "C55f",
      "Two Knights: 4.d3 Be7 5.c3",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 c3"
    ],
    [
      "C55l",
      "Two Knights: 4.d4",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d4"
    ],
    [
      "C55l",
      "Two Knights: 4.d4 exd4",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4"
    ],
    [
      "C55s",
      "Two Knights: 5.O-O",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O"
    ],
    [
      "C57a",
      "Two Knights: 4.Ng5",
      "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5"
    ],
    [
      "C60a",
      "Spanish (Ruy Lopez)",
      "e4 e5 Nf3 Nc6 Bb5"
    ],
    [
      "C60a",
      "Spanish: Spanish Countergambit",
      "e4 e5 Nf3 Nc6 Bb5 d5"
    ],
    [
      "C60b",
      "Spanish: 3...a5",
      "e4 e5 Nf3 Nc6 Bb5 a5"
    ],
    [
      "C60c",
      "Spanish: N\u00fcrnberg Variation",
      "e4 e5 Nf3 Nc6 Bb5 f6"
    ],
    [
      "C60d",
      "Spanish: Pollock Defence",
      "e4 e5 Nf3 Nc6 Bb5 Na5"
    ],
    [
      "C60e",
      "Spanish: Lucena Defence",
      "e4 e5 Nf3 Nc6 Bb5 Be7"
    ],
    [
      "C60f",
      "Spanish: Vinogradov Variation",
      "e4 e5 Nf3 Nc6 Bb5 Qe7"
    ],
    [
      "C60g",
      "Spanish: Brentano Variation",
      "e4 e5 Nf3 Nc6 Bb5 g5"
    ],
    [
      "C60h",
      "Spanish: Alapin Variation",
      "e4 e5 Nf3 Nc6 Bb5 Bb4"
    ],
    [
      "C60i",
      "Spanish: Alapin, 4.c3",
      "e4 e5 Nf3 Nc6 Bb5 Bb4 c3"
    ],
    [
      "C60j",
      "Spanish: Fianchetto (Smyslov) Defence",
      "e4 e5 Nf3 Nc6 Bb5 g6"
    ],
    [
      "C60k",
      "Spanish: Fianchetto, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 g6 O-O"
    ],
    [
      "C60l",
      "Spanish: Fianchetto, 4.d4",
      "e4 e5 Nf3 Nc6 Bb5 g6 d4"
    ],
    [
      "C60n",
      "Spanish: Fianchetto, 4.c3",
      "e4 e5 Nf3 Nc6 Bb5 g6 c3"
    ],
    [
      "C60o",
      "Spanish: Cozio Defence",
      "e4 e5 Nf3 Nc6 Bb5 Nge7"
    ],
    [
      "C60p",
      "Spanish: Cozio, 4.Nc3",
      "e4 e5 Nf3 Nc6 Bb5 Nge7 Nc3"
    ],
    [
      "C60r",
      "Spanish: Cozio, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 Nge7 c3"
    ],
    [
      "C60s",
      "Spanish: Cozio, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 Nge7 O-O"
    ],
    [
      "C60t",
      "Spanish: Cozio, 4.O-O g6",
      "e4 e5 Nf3 Nc6 Bb5 Nge7 O-O g6"
    ],
    [
      "C60u",
      "Spanish: Cozio, 4.O-O g6",
      "e4 e5 Nf3 Nc6 Bb5 Nge7 O-O g6 c3"
    ],
    [
      "C61a",
      "Spanish: Bird's Defence",
      "e4 e5 Nf3 Nc6 Bb5 Nd4"
    ],
    [
      "C61b",
      "Spanish: Bird's, 4.Bc4",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Bc4"
    ],
    [
      "C61c",
      "Spanish: Bird's, 4.Nxd4",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4"
    ],
    [
      "C61c",
      "Spanish: Bird's, 4.Nxd4 exd4",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4"
    ],
    [
      "C61d",
      "Spanish: Bird's, 5.d3",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 d3"
    ],
    [
      "C61e",
      "Spanish: Bird's, 5.Bc4",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 Bc4"
    ],
    [
      "C61f",
      "Spanish: Bird's, 5.O-O",
      "e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O"
    ],
    [
      "C62",
      "Spanish: Old Steinitz",
      "e4 e5 Nf3 Nc6 Bb5 d6"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.Bxc6+",
      "e4 e5 Nf3 Nc6 Bb5 d6 Bxc6+"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 d6 O-O"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.c3",
      "e4 e5 Nf3 Nc6 Bb5 d6 c3"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.d4",
      "e4 e5 Nf3 Nc6 Bb5 d6 d4"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.d4 exd4",
      "e4 e5 Nf3 Nc6 Bb5 d6 d4 exd4"
    ],
    [
      "C62",
      "Spanish: Old Steinitz, 4.d4 Bd7",
      "e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7"
    ],
    [
      "C63a",
      "Spanish: Schliemann (J\u00e4nisch)",
      "e4 e5 Nf3 Nc6 Bb5 f5"
    ],
    [
      "C63a",
      "Spanish: Schliemann, 4.Qe2",
      "e4 e5 Nf3 Nc6 Bb5 f5 Qe2"
    ],
    [
      "C63b",
      "Spanish: Schliemann, 4.exf5",
      "e4 e5 Nf3 Nc6 Bb5 f5 exf5"
    ],
    [
      "C63c",
      "Spanish: Schliemann, 4.d4",
      "e4 e5 Nf3 Nc6 Bb5 f5 d4"
    ],
    [
      "C63d",
      "Spanish: Schliemann, 4.d3",
      "e4 e5 Nf3 Nc6 Bb5 f5 d3"
    ],
    [
      "C63e",
      "Spanish: Schliemann, 4.d3 fxe4",
      "e4 e5 Nf3 Nc6 Bb5 f5 d3 fxe4"
    ],
    [
      "C63g",
      "Spanish: Schliemann, 4.Bxc6",
      "e4 e5 Nf3 Nc6 Bb5 f5 Bxc6"
    ],
    [
      "C63i",
      "Spanish: Schliemann, 4.Nc3",
      "e4 e5 Nf3 Nc6 Bb5 f5 Nc3"
    ],
    [
      "C63j",
      "Spanish: Schliemann, 4.Nc3 Nd4",
      "e4 e5 Nf3 Nc6 Bb5 f5 Nc3 Nd4"
    ],
    [
      "C63l",
      "Spanish: Schliemann, 4.Nc3 Nf6",
      "e4 e5 Nf3 Nc6 Bb5 f5 Nc3 Nf6"
    ],
    [
      "C64a",
      "Spanish: Classical Defence",
      "e4 e5 Nf3 Nc6 Bb5 Bc5"
    ],
    [
      "C64a",
      "Spanish: Classical, Exchange",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 Bxc6"
    ],
    [
      "C64b",
      "Spanish: Classical, 4.c3",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 c3"
    ],
    [
      "C64d",
      "Spanish: Classical, 4.c3 Nge7",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Nge7"
    ],
    [
      "C64e",
      "Spanish: Classical, 4.c3 Qf6",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Qf6"
    ],
    [
      "C64h",
      "Spanish: Classical, 4.c3 Nf6",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Nf6"
    ],
    [
      "C64k",
      "Spanish: Classical, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 O-O"
    ],
    [
      "C64l",
      "Spanish: Classical, 4.O-O Nge7",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 O-O Nge7"
    ],
    [
      "C64m",
      "Spanish: Classical, 4.O-O Qf6",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 O-O Qf6"
    ],
    [
      "C64n",
      "Spanish: Classical, 4.O-O d6",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 O-O d6"
    ],
    [
      "C64p",
      "Spanish: Classical, 4.O-O Nd4",
      "e4 e5 Nf3 Nc6 Bb5 Bc5 O-O Nd4"
    ],
    [
      "C65a",
      "Spanish: Berlin Defence",
      "e4 e5 Nf3 Nc6 Bb5 Nf6"
    ],
    [
      "C65b",
      "Spanish: Berlin, 4.Qe2",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 Qe2"
    ],
    [
      "C65c",
      "Spanish: Berlin, 4.d4",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 d4"
    ],
    [
      "C65d",
      "Spanish: Berlin, 4.d4 exd4",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 d4 exd4"
    ],
    [
      "C65f",
      "Spanish: Berlin, 4.d3",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 d3"
    ],
    [
      "C65h",
      "Spanish: Berlin, 4.d3 d6",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6"
    ],
    [
      "C65j",
      "Spanish: Berlin, 4.d3 Bc5",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5"
    ],
    [
      "C65k",
      "Spanish: Berlin, 4.O-O",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O"
    ],
    [
      "C65l",
      "Spanish: Berlin, 4.O-O Be7",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Be7"
    ],
    [
      "C66",
      "Spanish: Closed Berlin",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6"
    ],
    [
      "C67a",
      "Spanish: Open Berlin",
      "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4"
    ],
    [
      "C68a",
      "Spanish: 3...a6",
      "e4 e5 Nf3 Nc6 Bb5 a6"
    ],
    [
      "C68b",
      "Spanish: 3...a6 4.Bc4",
      "e4 e5 Nf3 Nc6 Bb5 a6 Bc4"
    ],
    [
      "C68c",
      "Spanish: Exchange Variation",
      "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6"
    ],
    [
      "C68c",
      "Spanish: Exchange, 4...bxc6",
      "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 bxc6"
    ],
    [
      "C68d",
      "Spanish: Exchange, 4...dxc6",
      "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6"
    ],
    [
      "C70",
      "Spanish: 4.Ba4",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4"
    ],
    [
      "C70",
      "Spanish: Brentano Variation",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 g5"
    ],
    [
      "C70",
      "Spanish: 4.Ba4 Be7",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Be7"
    ],
    [
      "C70",
      "Spanish: Fianchetto Deferred",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 g6"
    ],
    [
      "C70",
      "Spanish: Cozio Deferred",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nge7"
    ],
    [
      "C70",
      "Spanish: Bird's Deferred",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nd4"
    ],
    [
      "C70",
      "Spanish: Classical Deferred",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5"
    ],
    [
      "C70",
      "Spanish: Caro Variation",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5"
    ],
    [
      "C70",
      "Spanish: Graz Variation",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Bc5"
    ],
    [
      "C70",
      "Spanish: Schliemann Deferred",
      "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 f5"
    ],
    [
      "D00a",
      "Queen's Pawn Game",
      "d4 d5"
    ],
    [
      "D00a",
      "Queen's Pawn: 2.f4",
      "d4 d5 f4"
    ],
    [
      "D00a",
      "Queen's Pawn: 2.g3",
      "d4 d5 g3"
    ],
    [
      "D00b",
      "Queen's Pawn: 2.c3",
      "d4 d5 c3"
    ],
    [
      "D00b",
      "Queen's Pawn: 2.c3 Nf6",
      "d4 d5 c3 Nf6"
    ],
    [
      "D00b",
      "Queen's Pawn: 2.c3 Nf6 3.Bf4",
      "d4 d5 c3 Nf6 Bf4"
    ],
    [
      "D00b",
      "Queen's Pawn: 2.c3 Nf6 3.Bg5",
      "d4 d5 c3 Nf6 Bg5"
    ],
    [
      "D00c",
      "Queen's Pawn: Mason Variation",
      "d4 d5 Bf4"
    ],
    [
      "D00c",
      "Queen's Pawn, Mason, Steinitz Countergambit",
      "d4 d5 Bf4 c5"
    ],
    [
      "D00d",
      "Queen's Pawn: 2.e3",
      "d4 d5 e3"
    ],
    [
      "D00d",
      "Queen's Pawn: 2.e3 Nf6",
      "d4 d5 e3 Nf6"
    ],
    [
      "D00e",
      "Queen's Pawn: Stonewall Attack",
      "d4 d5 e3 Nf6 Bd3"
    ],
    [
      "D00f",
      "Hodgson Attack (Trompowsky vs. 1...d5)",
      "d4 d5 Bg5"
    ],
    [
      "D00f",
      "Hodgson Attack: Welling Variation",
      "d4 d5 Bg5 Bg4"
    ],
    [
      "D00f",
      "Hodgson Attack: 2...f6",
      "d4 d5 Bg5 f6"
    ],
    [
      "D00f",
      "Hodgson Attack: 2...g6",
      "d4 d5 Bg5 g6"
    ],
    [
      "D00g",
      "Hodgson Attack: 2...c6",
      "d4 d5 Bg5 c6"
    ],
    [
      "D00h",
      "Hodgson Attack, 2...h6",
      "d4 d5 Bg5 h6"
    ],
    [
      "D00h",
      "Hodgson Attack: 2...h6 3.Bh4 c6",
      "d4 d5 Bg5 h6 Bh4 c6"
    ],
    [
      "D00h",
      "Hodgson Attack: 2...h6 3.Bh4 c6 4.e3",
      "d4 d5 Bg5 h6 Bh4 c6 e3"
    ],
    [
      "D00i",
      "Trompowsky: 2...d5",
      "d4 Nf6 Bg5 d5"
    ],
    [
      "D00i",
      "Trompowsky: 2...d5 3.Nd2",
      "d4 Nf6 Bg5 d5 Nd2"
    ],
    [
      "D00i",
      "Trompowsky: 2...d5 3.e3",
      "d4 Nf6 Bg5 d5 e3"
    ],
    [
      "D00i",
      "Trompowsky: 2...d5 3.e3 e6",
      "d4 Nf6 Bg5 d5 e3 e6"
    ],
    [
      "D00j",
      "Trompowsky: 2...d5 3.Bxf6",
      "d4 Nf6 Bg5 d5 Bxf6"
    ],
    [
      "D00j",
      "Trompowsky: 2...d5 3.Bxf6 gxf6",
      "d4 Nf6 Bg5 d5 Bxf6 gxf6"
    ],
    [
      "D00k",
      "Trompowsky: 2...d5 3.Bxf6 exf6",
      "d4 Nf6 Bg5 d5 Bxf6 exf6"
    ],
    [
      "D00l",
      "Blackmar-Diemer Gambit (BDG): 2.e4",
      "d4 d5 e4"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Beyer Countergambit",
      "d4 d5 e4 e5"
    ],
    [
      "D00l",
      "Blackmar-Diemer Gambit (BDG): 2.e4 dxe4",
      "d4 d5 e4 dxe4"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Gedult Gambit",
      "d4 d5 e4 dxe4 f3"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Fritz Attack",
      "d4 d5 e4 dxe4 Bc4"
    ],
    [
      "D00l",
      "Blackmar-Diemer: 2.e4 dxe4 3.Nc3",
      "d4 d5 e4 dxe4 Nc3"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Grosshans Defence",
      "d4 d5 e4 dxe4 Nc3 Bd7"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Zeller Defence",
      "d4 d5 e4 dxe4 Nc3 Bf5"
    ],
    [
      "D00l",
      "Blackmar-Diemer: Pohmlann Defence",
      "d4 d5 e4 dxe4 Nc3 f5"
    ],
    [
      "D00m",
      "Blackmar-Diemer: Lemberger Countergambit",
      "d4 d5 e4 dxe4 Nc3 e5"
    ],
    [
      "D00n",
      "Queen's Pawn: Veresov Attack",
      "d4 d5 Nc3"
    ],
    [
      "D00n",
      "Queen's Pawn: Veresov Attack",
      "d4 d5 Nc3 Bf5"
    ],
    [
      "D00n",
      "Queen's Pawn: Veresov Attack",
      "d4 d5 Nc3 Nf6"
    ],
    [
      "D00o",
      "Queen's Pawn: Veresov, 3.Bf4",
      "d4 d5 Nc3 Nf6 Bf4"
    ],
    [
      "D00p",
      "Queen's Pawn: Veresov, 3.Nf3",
      "d4 d5 Nc3 Nf6 Nf3"
    ],
    [
      "D00p",
      "Queen's Pawn: Veresov, 3.Nf3 g6",
      "d4 d5 Nc3 Nf6 Nf3 g6"
    ],
    [
      "D00q",
      "Queen's Pawn: Anti-King's Indian",
      "d4 d5 Nc3 Nf6 Nf3 g6 Bf4"
    ],
    [
      "D00s",
      "Blackmar-Diemer Gambit (BDG)",
      "d4 d5 Nc3 Nf6 e4"
    ],
    [
      "D00s",
      "Blackmar-Diemer: Hubsch Gambit",
      "d4 d5 Nc3 Nf6 e4 Nxe4"
    ],
    [
      "D00t",
      "Blackmar-Diemer: 3...dxe4",
      "d4 d5 Nc3 Nf6 e4 dxe4"
    ],
    [
      "D00t",
      "Blackmar-Diemer: von Popiel Attack",
      "d4 d5 Nc3 Nf6 e4 dxe4 Bg5"
    ],
    [
      "D00u",
      "Blackmar-Diemer: 4.f3",
      "d4 d5 Nc3 Nf6 e4 dxe4 f3"
    ],
    [
      "D00u",
      "Blackmar-Diemer: O'Kelly Defence",
      "d4 d5 Nc3 Nf6 e4 dxe4 f3 c6"
    ],
    [
      "D00u",
      "Blackmar-Diemer: Lamb Defence",
      "d4 d5 Nc3 Nf6 e4 dxe4 f3 Nc6"
    ],
    [
      "D00u",
      "Blackmar-Diemer: Vienna Defence",
      "d4 d5 Nc3 Nf6 e4 dxe4 f3 Bf5"
    ],
    [
      "D01a",
      "Richter-Veresov Attack",
      "d4 d5 Nc3 Nf6 Bg5"
    ],
    [
      "D01b",
      "Richter-Veresov: 3...Ne4",
      "d4 d5 Nc3 Nf6 Bg5 Ne4"
    ],
    [
      "D01c",
      "Richter-Veresov: 3...e6",
      "d4 d5 Nc3 Nf6 Bg5 e6"
    ],
    [
      "D01d",
      "Richter-Veresov: 3...h6",
      "d4 d5 Nc3 Nf6 Bg5 h6"
    ],
    [
      "D01e",
      "Richter-Veresov: 3...g6",
      "d4 d5 Nc3 Nf6 Bg5 g6"
    ],
    [
      "D01f",
      "Richter-Veresov: 3...c6",
      "d4 d5 Nc3 Nf6 Bg5 c6"
    ],
    [
      "D01g",
      "Richter-Veresov: 3...c5",
      "d4 d5 Nc3 Nf6 Bg5 c5"
    ],
    [
      "D01h",
      "Richter-Veresov: 3...Bf5",
      "d4 d5 Nc3 Nf6 Bg5 Bf5"
    ],
    [
      "D01i",
      "Richter-Veresov: 3...Bf5 4.f3",
      "d4 d5 Nc3 Nf6 Bg5 Bf5 f3"
    ],
    [
      "D01j",
      "Richter-Veresov: 3...Bf5 4.Nf3",
      "d4 d5 Nc3 Nf6 Bg5 Bf5 Nf3"
    ],
    [
      "D01k",
      "Richter-Veresov: 3...Bf5 4.Bxf6",
      "d4 d5 Nc3 Nf6 Bg5 Bf5 Bxf6"
    ],
    [
      "D01l",
      "Richter-Veresov: 3...Nbd7",
      "d4 d5 Nc3 Nf6 Bg5 Nbd7"
    ],
    [
      "D01m",
      "Richter-Veresov: 3...Nbd7 4.f3",
      "d4 d5 Nc3 Nf6 Bg5 Nbd7 f3"
    ],
    [
      "D01n",
      "Richter-Veresov: 3...Nbd7 4.Nf3",
      "d4 d5 Nc3 Nf6 Bg5 Nbd7 Nf3"
    ],
    [
      "D02a",
      "Queen's Pawn: 2.Nf3",
      "d4 d5 Nf3"
    ],
    [
      "D02a",
      "Queen's Pawn: 2.Nf3 g6",
      "d4 d5 Nf3 g6"
    ],
    [
      "D02a",
      "Queen's Pawn: 2.Nf3 Bg4",
      "d4 d5 Nf3 Bg4"
    ],
    [
      "D02b",
      "Queen's Pawn: 2.Nf3 c6",
      "d4 d5 Nf3 c6"
    ],
    [
      "D02c",
      "Queen's Pawn: London",
      "d4 d5 Nf3 c6 Bf4"
    ],
    [
      "D02c",
      "Queen's Pawn: London, Alapin Variation",
      "d4 d5 Nf3 c6 Bf4 Qb6"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5",
      "d4 d5 Nf3 Bf5"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5 3.e3",
      "d4 d5 Nf3 Bf5 e3"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5 3.e3 c6",
      "d4 d5 Nf3 Bf5 e3 c6"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5 3.Bf4",
      "d4 d5 Nf3 Bf5 Bf4"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5 3.Bf4 c6",
      "d4 d5 Nf3 Bf5 Bf4 c6"
    ],
    [
      "D02d",
      "Queen's Pawn: 2.Nf3 Bf5 3.Bf4 e6",
      "d4 d5 Nf3 Bf5 Bf4 e6"
    ],
    [
      "D02e",
      "Queen's Pawn: 2.Nf3 Nc6",
      "d4 d5 Nf3 Nc6"
    ],
    [
      "D02f",
      "Queen's Pawn: 2.Nf3 Nc6 3.Bf4",
      "d4 d5 Nf3 Nc6 Bf4"
    ],
    [
      "D02g",
      "Queen's Pawn: 2.Nf3 Nc6 3.g3",
      "d4 d5 Nf3 Nc6 g3"
    ],
    [
      "D02g",
      "Queen's Pawn: 2.Nf3 Nc6 3.g3 Bg4",
      "d4 d5 Nf3 Nc6 g3 Bg4"
    ],
    [
      "D02h",
      "Queen's Pawn: 2.Nf3 e6",
      "d4 d5 Nf3 e6"
    ],
    [
      "D02i",
      "Queen's Pawn: 2.Nf3 e6 3.g3",
      "d4 d5 Nf3 e6 g3"
    ],
    [
      "D02i",
      "Queen's Pawn: 2.Nf3 e6 3.g3 c5",
      "d4 d5 Nf3 e6 g3 c5"
    ],
    [
      "D02i",
      "Queen's Pawn: 2.Nf3 e6 3.g3 c5",
      "d4 d5 Nf3 e6 g3 c5 Bg2"
    ],
    [
      "D02j",
      "Queen's Pawn: Krause Variation",
      "d4 d5 Nf3 c5"
    ],
    [
      "D02j",
      "Queen's Pawn: Krause, 3.c4",
      "d4 d5 Nf3 c5 c4"
    ],
    [
      "D02j",
      "Queen's Pawn: Krause, Reversed Slav",
      "d4 d5 Nf3 c5 c3"
    ],
    [
      "D02j",
      "Queen's Pawn: Krause, Reversed QGD",
      "d4 d5 Nf3 c5 e3"
    ],
    [
      "D02j",
      "Queen's Pawn: Krause, Reversed QGA",
      "d4 d5 Nf3 c5 dxc5"
    ],
    [
      "D02k",
      "Queen's Pawn: 2.Nf3 Nf6",
      "d4 d5 Nf3 Nf6"
    ],
    [
      "D02k",
      "Queen's Pawn: 3.c3",
      "d4 d5 Nf3 Nf6 c3"
    ],
    [
      "D02l",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4"
    ],
    [
      "D02m",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4 Bf5"
    ],
    [
      "D02n",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4 e6"
    ],
    [
      "D02o",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4 c5"
    ],
    [
      "D02p",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4 c5 e3 e6"
    ],
    [
      "D02p",
      "Queen's Pawn: London",
      "d4 d5 Nf3 Nf6 Bf4 c5 e3 e6 c3 Nc6"
    ],
    [
      "D02r",
      "Queen's Pawn: 3.g3",
      "d4 d5 Nf3 Nf6 g3"
    ],
    [
      "D02s",
      "Queen's Pawn: 3.g3 c6",
      "d4 d5 Nf3 Nf6 g3 c6"
    ],
    [
      "D02s",
      "Queen's Pawn: 3.g3 c6",
      "d4 d5 Nf3 Nf6 g3 c6 Bg2"
    ],
    [
      "D02t",
      "Queen's Pawn: 3.g3 c6 4.Bg2 Bg4",
      "d4 d5 Nf3 Nf6 g3 c6 Bg2 Bg4"
    ],
    [
      "D02u",
      "Queen's Pawn: 3.g3 g6",
      "d4 d5 Nf3 Nf6 g3 g6"
    ],
    [
      "D02u",
      "Queen's Pawn: 3.g3 g6",
      "d4 d5 Nf3 Nf6 g3 g6 Bg2 Bg7"
    ],
    [
      "D02u",
      "Queen's Pawn: 3.g3 g6",
      "d4 d5 Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O"
    ],
    [
      "D03a",
      "Torre Attack (Tartakower)",
      "d4 d5 Nf3 Nf6 Bg5"
    ],
    [
      "D03b",
      "Torre Attack: 3...Ne4",
      "d4 d5 Nf3 Nf6 Bg5 Ne4"
    ],
    [
      "D03c",
      "Torre Attack: 3...Ne4 4.Bf4",
      "d4 d5 Nf3 Nf6 Bg5 Ne4 Bf4"
    ],
    [
      "D03d",
      "Torre Attack: 3...e6",
      "d4 d5 Nf3 Nf6 Bg5 e6"
    ],
    [
      "D03e",
      "Torre Attack: 3...e6 4.e3",
      "d4 d5 Nf3 Nf6 Bg5 e6 e3"
    ],
    [
      "D03f",
      "Torre Attack: 3...e6 4.e3 Nbd7",
      "d4 d5 Nf3 Nf6 Bg5 e6 e3 Nbd7"
    ],
    [
      "D03g",
      "Torre Attack: 3...e6 4.e3 c5",
      "d4 d5 Nf3 Nf6 Bg5 e6 e3 c5"
    ],
    [
      "D03k",
      "Torre Attack: 3...g6",
      "d4 d5 Nf3 Nf6 Bg5 g6"
    ],
    [
      "D03k",
      "Torre Attack: 3...g6",
      "d4 d5 Nf3 Nf6 Bg5 g6 c3 Bg7"
    ],
    [
      "D03l",
      "Torre Attack: 3...g6",
      "d4 d5 Nf3 Nf6 Bg5 g6 Nbd2"
    ],
    [
      "D03l",
      "Torre Attack: 3...g6",
      "d4 d5 Nf3 Nf6 Bg5 g6 Nbd2 Bg7"
    ],
    [
      "D03m",
      "Torre Attack: 3...g6 4.e3",
      "d4 d5 Nf3 Nf6 Bg5 g6 e3"
    ],
    [
      "D03m",
      "Torre Attack: 3...g6 4.e3",
      "d4 d5 Nf3 Nf6 Bg5 g6 e3 Bg7"
    ],
    [
      "D04a",
      "Queen's Pawn: Colle",
      "d4 d5 Nf3 Nf6 e3"
    ],
    [
      "D04b",
      "Colle: 3...Bg4",
      "d4 d5 Nf3 Nf6 e3 Bg4"
    ],
    [
      "D04c",
      "Colle: 3...Bf5",
      "d4 d5 Nf3 Nf6 e3 Bf5"
    ],
    [
      "D04d",
      "Colle: 3...Bf5, Alekhine Variation",
      "d4 d5 Nf3 Nf6 e3 Bf5 Bd3 e6"
    ],
    [
      "D04e",
      "Colle: 3...g6",
      "d4 d5 Nf3 Nf6 e3 g6"
    ],
    [
      "D04f",
      "Colle: 3...c6",
      "d4 d5 Nf3 Nf6 e3 c6"
    ],
    [
      "D04g",
      "Colle: 3...c5",
      "d4 d5 Nf3 Nf6 e3 c5"
    ],
    [
      "D04h",
      "Colle: 3...c5 4.c3",
      "d4 d5 Nf3 Nf6 e3 c5 c3"
    ],
    [
      "D04i",
      "Colle: 3...c5 4.c3 Nc6",
      "d4 d5 Nf3 Nf6 e3 c5 c3 Nc6"
    ],
    [
      "D04j",
      "Colle: 3...c5 4.c3 Nbd7",
      "d4 d5 Nf3 Nf6 e3 c5 c3 Nbd7"
    ],
    [
      "D05a",
      "Colle: 3...e6",
      "d4 d5 Nf3 Nf6 e3 e6"
    ],
    [
      "D05b",
      "Colle: 3...e6 4.Nbd2",
      "d4 d5 Nf3 Nf6 e3 e6 Nbd2"
    ],
    [
      "D05c",
      "Colle: Zukertort Variation",
      "d4 d5 Nf3 Nf6 e3 e6 Nbd2 c5 b3"
    ],
    [
      "D05d",
      "Colle: 3...e6 4.Bd3",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3"
    ],
    [
      "D05e",
      "Colle: 3...e6 4.Bd3 c5",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5"
    ],
    [
      "D05f",
      "Colle: Rubinstein's Attack",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 b3"
    ],
    [
      "D05h",
      "Colle: 5.c3",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 c3"
    ],
    [
      "D05i",
      "Colle: 5.c3 Nbd7",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 c3 Nbd7"
    ],
    [
      "D05j",
      "Colle: 5.c3 Nc6",
      "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 c3 Nc6"
    ],
    [
      "D06a",
      "Queen's Gambit",
      "d4 d5 c4"
    ],
    [
      "D06b",
      "QGD: Austrian Defence",
      "d4 d5 c4 c5"
    ],
    [
      "D06b",
      "QGD: Austrian, Rubinstein Variation",
      "d4 d5 c4 c5 cxd5 Nf6"
    ],
    [
      "D06b",
      "QGD: Austrian, Rubinstein, 4.dxc5",
      "d4 d5 c4 c5 cxd5 Nf6 dxc5"
    ],
    [
      "D06c",
      "QGD: Austrian, Rubinstein, 4.Nf3",
      "d4 d5 c4 c5 cxd5 Nf6 Nf3"
    ],
    [
      "D06e",
      "QGD: Marshall Defence",
      "d4 d5 c4 Nf6"
    ],
    [
      "D06f",
      "QGD: Marshall Defence, 3.Nc3",
      "d4 d5 c4 Nf6 Nc3"
    ],
    [
      "D06g",
      "QGD: Marshall Defence, 3.Nf3",
      "d4 d5 c4 Nf6 Nf3"
    ],
    [
      "D06h",
      "QGD: Marshall Defence, 3.cxd5",
      "d4 d5 c4 Nf6 cxd5"
    ],
    [
      "D06i",
      "QGD: Marshall Defence, 3.cxd5 Nxd5",
      "d4 d5 c4 Nf6 cxd5 Nxd5"
    ],
    [
      "D06l",
      "QGD: 2...Bf5",
      "d4 d5 c4 Bf5"
    ],
    [
      "D06l",
      "QGD: 2...Bf5 3.Qb3",
      "d4 d5 c4 Bf5 Qb3"
    ],
    [
      "D06m",
      "QGD: 2...Bf5 3.Nc3",
      "d4 d5 c4 Bf5 Nc3"
    ],
    [
      "D06m",
      "QGD: 2...Bf5 3.Nc3 e6",
      "d4 d5 c4 Bf5 Nc3 e6"
    ],
    [
      "D06n",
      "QGD: 2...Bf5 3.Nf3",
      "d4 d5 c4 Bf5 Nf3"
    ],
    [
      "D06n",
      "QGD: 2...Bf5 3.Nf3 e6",
      "d4 d5 c4 Bf5 Nf3 e6"
    ],
    [
      "D06o",
      "QGD: 2...Bf5 3.Nf3 e6 4.Qb3",
      "d4 d5 c4 Bf5 Nf3 e6 Qb3"
    ],
    [
      "D06p",
      "QGD: 2...Bf5 3.Nf3 e6 4.Nc3",
      "d4 d5 c4 Bf5 Nf3 e6 Nc3"
    ],
    [
      "D06q",
      "QGD: 2...Bf5 3.Nf3 e6 4.Nc3 Nf6",
      "d4 d5 c4 Bf5 Nf3 e6 Nc3 Nf6"
    ],
    [
      "D06r",
      "QGD: 2...Bf5 3.cxd5",
      "d4 d5 c4 Bf5 cxd5"
    ],
    [
      "D06s",
      "QGD: 2...Bf5 3.cxd5 Bxb1 4.Rxb1",
      "d4 d5 c4 Bf5 cxd5 Bxb1 Rxb1"
    ],
    [
      "D06t",
      "QGD: 2...Bf5 3.cxd5 Bxb1 4.Qa4+",
      "d4 d5 c4 Bf5 cxd5 Bxb1 Qa4+"
    ],
    [
      "D07a",
      "QGD: Chigorin Defence",
      "d4 d5 c4 Nc6"
    ],
    [
      "D07b",
      "QGD: Chigorin, 3.e3",
      "d4 d5 c4 Nc6 e3"
    ],
    [
      "D07c",
      "QGD: Chigorin, 3.cxd5",
      "d4 d5 c4 Nc6 cxd5"
    ],
    [
      "D07f",
      "QGD: Chigorin, 3.Nf3",
      "d4 d5 c4 Nc6 Nf3"
    ],
    [
      "D07g",
      "QGD: Chigorin, Lazard Gambit",
      "d4 d5 c4 Nc6 Nf3 e5"
    ],
    [
      "D07h",
      "QGD: Chigorin, 3.Nf3 Bg4",
      "d4 d5 c4 Nc6 Nf3 Bg4"
    ],
    [
      "D07i",
      "QGD: Chigorin, 3.Nf3 Bg4 4.e3",
      "d4 d5 c4 Nc6 Nf3 Bg4 e3"
    ],
    [
      "D07j",
      "QGD: Chigorin, 3.Nf3 Bg4 4.Nc3",
      "d4 d5 c4 Nc6 Nf3 Bg4 Nc3"
    ],
    [
      "D07k",
      "QGD: Chigorin, 3.Nf3 Bg4 4.cxd5",
      "d4 d5 c4 Nc6 Nf3 Bg4 cxd5"
    ],
    [
      "D07n",
      "QGD: Chigorin, 3.Nc3",
      "d4 d5 c4 Nc6 Nc3"
    ],
    [
      "D07o",
      "QGD: Chigorin, Tartakower Gambit",
      "d4 d5 c4 Nc6 Nc3 e5"
    ],
    [
      "D07p",
      "QGD: Chigorin, 3.Nc3 Nf6",
      "d4 d5 c4 Nc6 Nc3 Nf6"
    ],
    [
      "D07q",
      "QGD: Chigorin, 3.Nc3 Nf6 4.Nf3",
      "d4 d5 c4 Nc6 Nc3 Nf6 Nf3"
    ],
    [
      "D07s",
      "QGD: Chigorin, 3.Nc3 dxc4",
      "d4 d5 c4 Nc6 Nc3 dxc4"
    ],
    [
      "D07t",
      "QGD: Chigorin, 3.Nc3 dxc4 4.d5",
      "d4 d5 c4 Nc6 Nc3 dxc4 d5"
    ],
    [
      "D07u",
      "QGD: Chigorin, 3.Nc3 dxc4 4.Nf3",
      "d4 d5 c4 Nc6 Nc3 dxc4 Nf3"
    ],
    [
      "D08",
      "QGD: Albin Countergambit",
      "d4 d5 c4 e5"
    ],
    [
      "D08",
      "QGD: Albin, 3.e3",
      "d4 d5 c4 e5 e3"
    ],
    [
      "D08",
      "QGD: Albin, 3.dxe5",
      "d4 d5 c4 e5 dxe5"
    ],
    [
      "D08",
      "QGD: Albin, 3.dxe5 d4",
      "d4 d5 c4 e5 dxe5 d4"
    ],
    [
      "D08",
      "QGD: Albin, 4.e4",
      "d4 d5 c4 e5 dxe5 d4 e4"
    ],
    [
      "D08",
      "QGD: Albin, 4.a3",
      "d4 d5 c4 e5 dxe5 d4 a3"
    ],
    [
      "D08",
      "QGD: Albin, 4.Nf3",
      "d4 d5 c4 e5 dxe5 d4 Nf3"
    ],
    [
      "D08",
      "QGD: Albin, 4.Nf3 Nc6",
      "d4 d5 c4 e5 dxe5 d4 Nf3 Nc6"
    ],
    [
      "D08",
      "QGD: Albin, 4.Nf3 Nc6 5.a3",
      "d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 a3"
    ],
    [
      "D10a",
      "Slav Defence",
      "d4 d5 c4 c6"
    ],
    [
      "D10a",
      "Diemer-Duhm Gambit (DDG) vs. Slav/Caro-Kann",
      "d4 d5 c4 c6 e4"
    ],
    [
      "D10a",
      "Slav: 3.g3",
      "d4 d5 c4 c6 g3"
    ],
    [
      "D10a",
      "Slav: 3.Bf4",
      "d4 d5 c4 c6 Bf4"
    ],
    [
      "D10b",
      "Slav: Exchange",
      "d4 d5 c4 c6 cxd5"
    ],
    [
      "D10b",
      "Slav: Exchange",
      "d4 d5 c4 c6 cxd5 cxd5"
    ],
    [
      "D10c",
      "Slav: Exchange, 4.Bf4",
      "d4 d5 c4 c6 cxd5 cxd5 Bf4"
    ],
    [
      "D10d",
      "Slav: Exchange, 4.Nf3",
      "d4 d5 c4 c6 cxd5 cxd5 Nf3"
    ],
    [
      "D10e",
      "Slav: Exchange, 4.Nc3",
      "d4 d5 c4 c6 cxd5 cxd5 Nc3"
    ],
    [
      "D10e",
      "Slav: Exchange, 4.Nc3 Nf6",
      "d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6"
    ],
    [
      "D10h",
      "Slav: 3.e3",
      "d4 d5 c4 c6 e3"
    ],
    [
      "D10h",
      "Slav: 3.e3 Bf5",
      "d4 d5 c4 c6 e3 Bf5"
    ],
    [
      "D10h",
      "Slav: 3.e3 Nf6",
      "d4 d5 c4 c6 e3 Nf6"
    ],
    [
      "D10i",
      "Slav: 3.Nc3",
      "d4 d5 c4 c6 Nc3"
    ],
    [
      "D10j",
      "Slav: Winawer Countergambit",
      "d4 d5 c4 c6 Nc3 e5"
    ],
    [
      "D10k",
      "Slav: Winawer Countergambit, 4.cxd5",
      "d4 d5 c4 c6 Nc3 e5 cxd5"
    ],
    [
      "D10m",
      "Slav: Winawer Countergambit Accepted",
      "d4 d5 c4 c6 Nc3 e5 dxe5"
    ],
    [
      "D10o",
      "Slav: 3.Nc3 dxc4",
      "d4 d5 c4 c6 Nc3 dxc4"
    ],
    [
      "D10o",
      "Slav: 3.Nc3 dxc4 4.a4",
      "d4 d5 c4 c6 Nc3 dxc4 a4"
    ],
    [
      "D10o",
      "Slav: 3.Nc3 dxc4 4.e3",
      "d4 d5 c4 c6 Nc3 dxc4 e3"
    ],
    [
      "D10p",
      "Slav: 3.Nc3 dxc4 4.e4",
      "d4 d5 c4 c6 Nc3 dxc4 e4"
    ],
    [
      "D10q",
      "Slav: 3.Nc3 dxc4 4.e4 b5",
      "d4 d5 c4 c6 Nc3 dxc4 e4 b5"
    ],
    [
      "D10r",
      "Slav: 3.Nc3 dxc4 4.e4 b5 5.a4",
      "d4 d5 c4 c6 Nc3 dxc4 e4 b5 a4"
    ],
    [
      "D10r",
      "Slav: 3.Nc3 Nf6",
      "d4 d5 c4 c6 Nc3 Nf6"
    ],
    [
      "D10s",
      "Slav: 3.Nc3 Nf6 4.Bg5",
      "d4 d5 c4 c6 Nc3 Nf6 Bg5"
    ],
    [
      "D10t",
      "Slav: 3.Nc3 Nf6 4.Bg5 dxc4",
      "d4 d5 c4 c6 Nc3 Nf6 Bg5 dxc4"
    ],
    [
      "D10u",
      "Slav: 3.Nc3 Nf6 4.e3",
      "d4 d5 c4 c6 Nc3 Nf6 e3"
    ],
    [
      "D10v",
      "Slav: 3.Nc3 Nf6 4.e3 Bf5",
      "d4 d5 c4 c6 Nc3 Nf6 e3 Bf5"
    ],
    [
      "D10w",
      "Slav: 3.Nc3 Nf6 4.e3 a6",
      "d4 d5 c4 c6 Nc3 Nf6 e3 a6"
    ],
    [
      "D10w",
      "Slav: 3.Nc3 Nf6 4.e3 a6 5.Bd3",
      "d4 d5 c4 c6 Nc3 Nf6 e3 a6 Bd3"
    ],
    [
      "D10x",
      "Slav: 3.Nc3 Nf6 4.e3 a6 5.Qc2",
      "d4 d5 c4 c6 Nc3 Nf6 e3 a6 Qc2"
    ],
    [
      "D11a",
      "Slav: 3.Nf3",
      "d4 d5 c4 c6 Nf3"
    ],
    [
      "D11b",
      "Slav: 3.Nf3 Bg4",
      "d4 d5 c4 c6 Nf3 Bg4"
    ],
    [
      "D11c",
      "Slav: 3.Nf3 Bf5",
      "d4 d5 c4 c6 Nf3 Bf5"
    ],
    [
      "D11c",
      "Slav: 3.Nf3 Bf5 4.Nc3",
      "d4 d5 c4 c6 Nf3 Bf5 Nc3"
    ],
    [
      "D11c",
      "Slav: 3.Nf3 Bf5 4.Nc3 e6",
      "d4 d5 c4 c6 Nf3 Bf5 Nc3 e6"
    ],
    [
      "D11e",
      "Slav: 3.Nf3 dxc4",
      "d4 d5 c4 c6 Nf3 dxc4"
    ],
    [
      "D11e",
      "Slav: 3.Nf3 dxc4 4.Nc3",
      "d4 d5 c4 c6 Nf3 dxc4 Nc3"
    ],
    [
      "D11e",
      "Slav: 3.Nf3 dxc4 4.e3",
      "d4 d5 c4 c6 Nf3 dxc4 e3"
    ],
    [
      "D11e",
      "Slav: 3.Nf3 dxc4 4.e3 Be6",
      "d4 d5 c4 c6 Nf3 dxc4 e3 Be6"
    ],
    [
      "D11f",
      "Slav: 3.Nf3 dxc4 4.e3 b5",
      "d4 d5 c4 c6 Nf3 dxc4 e3 b5"
    ],
    [
      "D11f",
      "Slav: 3.Nf3 dxc4 4.e3 b5 5.a4",
      "d4 d5 c4 c6 Nf3 dxc4 e3 b5 a4"
    ],
    [
      "D11g",
      "Slav: 3.Nf3 Nf6",
      "d4 d5 c4 c6 Nf3 Nf6"
    ],
    [
      "D11h",
      "Slav: 4.Qb3",
      "d4 d5 c4 c6 Nf3 Nf6 Qb3"
    ],
    [
      "D11i",
      "Slav: 4.Qc2",
      "d4 d5 c4 c6 Nf3 Nf6 Qc2"
    ],
    [
      "D11j",
      "Slav: 4.Qc2 g6 5.Bf4",
      "d4 d5 c4 c6 Nf3 Nf6 Qc2 g6 Bf4"
    ],
    [
      "D11k",
      "Slav: Breyer Variation",
      "d4 d5 c4 c6 Nf3 Nf6 Nbd2"
    ],
    [
      "D11l",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3"
    ],
    [
      "D11m",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bg4"
    ],
    [
      "D11m",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bg4 Bg2"
    ],
    [
      "D11m",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bg4 Bg2 e6"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11o",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11p",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11p",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11p",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11p",
      "Slav: Slav-Reti System",
      "d4 d5 c4 c6 Nf3 Nf6 g3 Bf5 Bg2 e6"
    ],
    [
      "D11q",
      "Slav: 4.e3",
      "d4 d5 c4 c6 Nf3 Nf6 e3"
    ],
    [
      "D11r",
      "Slav: 4.e3 g6",
      "d4 d5 c4 c6 Nf3 Nf6 e3 g6"
    ],
    [
      "D11s",
      "Slav: 4.e3 a6",
      "d4 d5 c4 c6 Nf3 Nf6 e3 a6"
    ],
    [
      "D11t",
      "Slav: 4.e3 Bg4",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bg4"
    ],
    [
      "D11t",
      "Slav: 4.e3 Bg4",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bg4 Nc3"
    ],
    [
      "D12a",
      "Slav: 4.e3 Bf5",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5"
    ],
    [
      "D12b",
      "Slav: 4.e3 Bf5 5.Qb3",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Qb3"
    ],
    [
      "D12c",
      "Slav: 4.e3 Bf5 5.cxd5",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 cxd5"
    ],
    [
      "D12c",
      "Slav: 4.e3 Bf5 5.cxd5",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 cxd5 cxd5"
    ],
    [
      "D12g",
      "Slav: 4.e3 Bf5 5.Bd3",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Bd3"
    ],
    [
      "D12i",
      "Slav: 4.e3 Bf5 5.Nc3",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3"
    ],
    [
      "D12i",
      "Slav: 4.e3 Bf5 5.Nc3 e6",
      "d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6"
    ],
    [
      "D13a",
      "Slav: Exchange",
      "d4 d5 c4 c6 Nf3 Nf6 cxd5"
    ],
    [
      "D13b",
      "Slav: Exchange",
      "d4 d5 c4 c6 Nf3 Nf6 cxd5 cxd5"
    ],
    [
      "D13c",
      "Slav: Exchange, 5.Nc3",
      "d4 d5 c4 c6 Nf3 Nf6 cxd5 cxd5 Nc3"
    ],
    [
      "D15a",
      "Slav: 4.Nc3",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3"
    ],
    [
      "D15b",
      "Slav: 4.Nc3 Bf5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 Bf5"
    ],
    [
      "D15b",
      "Slav: 4.Nc3 Bf5 5.Qb3",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 Bf5 Qb3"
    ],
    [
      "D15c",
      "Slav: S\u00fcchting Variation",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 Qb6"
    ],
    [
      "D15d",
      "Slav: Chameleon Variation",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6"
    ],
    [
      "D15e",
      "Slav: Chameleon, 5.Bg5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 Bg5"
    ],
    [
      "D15f",
      "Slav: Chameleon, 5.Ne5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 Ne5"
    ],
    [
      "D15g",
      "Slav: Chameleon, 5.e3",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 e3"
    ],
    [
      "D15h",
      "Slav: Chameleon, 5.e3 b5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 e3 b5"
    ],
    [
      "D15j",
      "Slav: Chameleon, 5.c5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 c5"
    ],
    [
      "D15l",
      "Slav: Chameleon, 5.a4",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 a4"
    ],
    [
      "D15m",
      "Slav: Chameleon, 5.a4 e6",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 a4 e6"
    ],
    [
      "D15o",
      "Slav: Accepted",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4"
    ],
    [
      "D15p",
      "Slav: Accepted, 5.Ne5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 Ne5"
    ],
    [
      "D16a",
      "Slav: Alapin",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4"
    ],
    [
      "D16b",
      "Slav: 5.a4 Nd5",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Nd5"
    ],
    [
      "D16d",
      "Slav: Murey Variation",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 a5"
    ],
    [
      "D16e",
      "Slav: Smyslov Variation",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Na6"
    ],
    [
      "D17a",
      "Slav: Czech Defence",
      "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5"
    ],
    [
      "D20a",
      "Queen's Gambit Accepted (QGA)",
      "d4 d5 c4 dxc4"
    ],
    [
      "D20a",
      "QGA: 3.Qa4+",
      "d4 d5 c4 dxc4 Qa4+"
    ],
    [
      "D20b",
      "QGA: 3.e3",
      "d4 d5 c4 dxc4 e3"
    ],
    [
      "D20c",
      "QGA: 3.e3 c5",
      "d4 d5 c4 dxc4 e3 c5"
    ],
    [
      "D20c",
      "QGA: 3.e3 c5 4.Bxc4",
      "d4 d5 c4 dxc4 e3 c5 Bxc4"
    ],
    [
      "D20c",
      "QGA: 3.e3 c5 4.Bxc4",
      "d4 d5 c4 dxc4 e3 c5 Bxc4 cxd4 exd4"
    ],
    [
      "D20d",
      "QGA: 3.e3 e6",
      "d4 d5 c4 dxc4 e3 e6"
    ],
    [
      "D20d",
      "QGA: 3.e3 e6",
      "d4 d5 c4 dxc4 e3 e6 Bxc4 Nf6"
    ],
    [
      "D20e",
      "QGA: 3.e3 e5",
      "d4 d5 c4 dxc4 e3 e5"
    ],
    [
      "D20e",
      "QGA: 3.e3 e5",
      "d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 exd4"
    ],
    [
      "D20f",
      "QGA: 3.e3 e5",
      "d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 exd4 Bb4+"
    ],
    [
      "D20g",
      "QGA: 3.e3 e5",
      "d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 exd4 Nf6"
    ],
    [
      "D20h",
      "QGA: 3.e3 Nf6",
      "d4 d5 c4 dxc4 e3 Nf6"
    ],
    [
      "D20i",
      "QGA: 3.Nc3",
      "d4 d5 c4 dxc4 Nc3"
    ],
    [
      "D20i",
      "QGA: 3.Nc3 c5",
      "d4 d5 c4 dxc4 Nc3 c5"
    ],
    [
      "D20i",
      "QGA: 3.Nc3 e5",
      "d4 d5 c4 dxc4 Nc3 e5"
    ],
    [
      "D20i",
      "QGA: 3.Nc3 Nf6",
      "d4 d5 c4 dxc4 Nc3 Nf6"
    ],
    [
      "D20j",
      "QGA: 3.Nc3 e6",
      "d4 d5 c4 dxc4 Nc3 e6"
    ],
    [
      "D20j",
      "QGA: 3.Nc3 e6 4.e4",
      "d4 d5 c4 dxc4 Nc3 e6 e4"
    ],
    [
      "D20k",
      "QGA: 3.Nc3 a6",
      "d4 d5 c4 dxc4 Nc3 a6"
    ],
    [
      "D20k",
      "QGA: 3.Nc3 a6 4.a4",
      "d4 d5 c4 dxc4 Nc3 a6 a4"
    ],
    [
      "D20l",
      "QGA: 3.e4",
      "d4 d5 c4 dxc4 e4"
    ],
    [
      "D20l",
      "QGA: 3.e4, Schwartz Defence",
      "d4 d5 c4 dxc4 e4 f5"
    ],
    [
      "D20m",
      "QGA: 3.e4 Nc6",
      "d4 d5 c4 dxc4 e4 Nc6"
    ],
    [
      "D20m",
      "QGA: 3.e4 Nc6 4.Nf3",
      "d4 d5 c4 dxc4 e4 Nc6 Nf3"
    ],
    [
      "D20n",
      "QGA: 3.e4 Nc6 4.Be3",
      "d4 d5 c4 dxc4 e4 Nc6 Be3"
    ],
    [
      "D20o",
      "QGA: 3.e4 Nf6",
      "d4 d5 c4 dxc4 e4 Nf6"
    ],
    [
      "D20o",
      "QGA: 3.e4 Nf6 4.Nc3",
      "d4 d5 c4 dxc4 e4 Nf6 Nc3"
    ],
    [
      "D20o",
      "QGA: 3.e4 Nf6 4.e5",
      "d4 d5 c4 dxc4 e4 Nf6 e5"
    ],
    [
      "D20o",
      "QGA: 3.e4 Nf6 4.e5 Nd5",
      "d4 d5 c4 dxc4 e4 Nf6 e5 Nd5"
    ],
    [
      "D20s",
      "QGA: 3.e4 c5",
      "d4 d5 c4 dxc4 e4 c5"
    ],
    [
      "D20s",
      "QGA: 3.e4 c5",
      "d4 d5 c4 dxc4 e4 c5 Nf3"
    ],
    [
      "D20t",
      "QGA: 3.e4 c5 4.d5",
      "d4 d5 c4 dxc4 e4 c5 d5"
    ],
    [
      "D20u",
      "QGA: Linares Variation",
      "d4 d5 c4 dxc4 e4 c5 d5 Nf6 Nc3 b5"
    ],
    [
      "D20v",
      "QGA: 3.e4 e5",
      "d4 d5 c4 dxc4 e4 e5"
    ],
    [
      "D20w",
      "QGA: 3.e4 e5 4.Nf3 Bb4+",
      "d4 d5 c4 dxc4 e4 e5 Nf3 Bb4+"
    ],
    [
      "D20x",
      "QGA: 3.e4 e5 4.Nf3 exd4",
      "d4 d5 c4 dxc4 e4 e5 Nf3 exd4"
    ],
    [
      "D21a",
      "QGA: 3.Nf3",
      "d4 d5 c4 dxc4 Nf3"
    ],
    [
      "D21a",
      "QGA: Ericson Variation",
      "d4 d5 c4 dxc4 Nf3 b5"
    ],
    [
      "D21b",
      "QGA: 3.Nf3 Nd7",
      "d4 d5 c4 dxc4 Nf3 Nd7"
    ],
    [
      "D21c",
      "QGA: 3.Nf3 Bg4",
      "d4 d5 c4 dxc4 Nf3 Bg4"
    ],
    [
      "D21d",
      "QGA: 3.Nf3 e6",
      "d4 d5 c4 dxc4 Nf3 e6"
    ],
    [
      "D21e",
      "QGA: 3.Nf3 e6 4.Qa4+",
      "d4 d5 c4 dxc4 Nf3 e6 Qa4+"
    ],
    [
      "D21f",
      "QGA: 3.Nf3 e6 4.e4",
      "d4 d5 c4 dxc4 Nf3 e6 e4"
    ],
    [
      "D21g",
      "QGA: 3.Nf3 e6 4.e3",
      "d4 d5 c4 dxc4 Nf3 e6 e3"
    ],
    [
      "D21g",
      "QGA: 3.Nf3 e6 4.e3 c5",
      "d4 d5 c4 dxc4 Nf3 e6 e3 c5"
    ],
    [
      "D21h",
      "QGA: 3.Nf3 c5",
      "d4 d5 c4 dxc4 Nf3 c5"
    ],
    [
      "D21i",
      "QGA: 3.Nf3 c5 4.Nc3",
      "d4 d5 c4 dxc4 Nf3 c5 Nc3"
    ],
    [
      "D21j",
      "QGA: 3.Nf3 c5 4.e3",
      "d4 d5 c4 dxc4 Nf3 c5 e3"
    ],
    [
      "D21j",
      "QGA: 3.Nf3 c5 4.e3 cxd4",
      "d4 d5 c4 dxc4 Nf3 c5 e3 cxd4"
    ],
    [
      "D21l",
      "QGA: 3.Nf3 c5 4.d5",
      "d4 d5 c4 dxc4 Nf3 c5 d5"
    ],
    [
      "D21m",
      "QGA: 3.Nf3 c5 4.d5 e6",
      "d4 d5 c4 dxc4 Nf3 c5 d5 e6"
    ],
    [
      "D21m",
      "QGA: 3.Nf3 c5 4.d5 e6 5.e4",
      "d4 d5 c4 dxc4 Nf3 c5 d5 e6 e4"
    ],
    [
      "D21n",
      "QGA: 3.Nf3 c5 4.d5 e6 5.Nc3",
      "d4 d5 c4 dxc4 Nf3 c5 d5 e6 Nc3"
    ],
    [
      "D21t",
      "QGA: Alekhine Defence",
      "d4 d5 c4 dxc4 Nf3 a6"
    ],
    [
      "D21v",
      "QGA: Alekhine, 4.a4",
      "d4 d5 c4 dxc4 Nf3 a6 a4"
    ],
    [
      "D22a",
      "QGA: Alekhine, 4.e3",
      "d4 d5 c4 dxc4 Nf3 a6 e3"
    ],
    [
      "D22c",
      "QGA: Alekhine, 4.e3 e6",
      "d4 d5 c4 dxc4 Nf3 a6 e3 e6"
    ],
    [
      "D23a",
      "QGA: 3.Nf3 Nf6",
      "d4 d5 c4 dxc4 Nf3 Nf6"
    ],
    [
      "D23b",
      "QGA: 3.Nf3 Nf6 4.g3",
      "d4 d5 c4 dxc4 Nf3 Nf6 g3"
    ],
    [
      "D23c",
      "QGA: Mannheim Variation",
      "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+"
    ],
    [
      "D23d",
      "QGA: Mannheim, 4...Nc6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+ Nc6"
    ],
    [
      "D23e",
      "QGA: Mannheim, 4...Nc6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+ Nc6 Nc3"
    ],
    [
      "D23f",
      "QGA: Mannheim, 4...Nbd7",
      "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+ Nbd7"
    ],
    [
      "D23i",
      "QGA: Mannheim, 4...c6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+ c6"
    ],
    [
      "D24a",
      "QGA: 4.Nc3",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3"
    ],
    [
      "D24a",
      "QGA: 4.Nc3 Nd5",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 Nd5"
    ],
    [
      "D24b",
      "QGA: 4.Nc3 e6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 e6"
    ],
    [
      "D24b",
      "QGA: 4.Nc3 e6 5.Bg5",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 e6 Bg5"
    ],
    [
      "D24b",
      "QGA: 4.Nc3 e6 5.e4",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 e6 e4"
    ],
    [
      "D24c",
      "QGA: 4.Nc3 e6 5.e3",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 e6 e3"
    ],
    [
      "D24d",
      "QGA: 4.Nc3 c5",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 c5"
    ],
    [
      "D24e",
      "QGA: 4.Nc3 c5 5.d5",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 c5 d5"
    ],
    [
      "D24h",
      "QGA: 4.Nc3 a6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6"
    ],
    [
      "D24i",
      "QGA: 4.Nc3 a6 5.a4",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6 a4"
    ],
    [
      "D24j",
      "QGA: 4.Nc3 a6 5.a4 Nc6",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6 a4 Nc6"
    ],
    [
      "D24k",
      "QGA: Bogoljubow",
      "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6 e4"
    ],
    [
      "D25a",
      "QGA: 4.e3",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3"
    ],
    [
      "D25b",
      "QGA: 4.e3 c5",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 c5"
    ],
    [
      "D25c",
      "QGA: 4.e3 a6",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 a6"
    ],
    [
      "D25d",
      "QGA: Smyslov Variation",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 g6"
    ],
    [
      "D25f",
      "QGA: Flohr Variation",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 Be6"
    ],
    [
      "D25f",
      "QGA: Flohr, 5.Nc3",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 Be6 Nc3"
    ],
    [
      "D25f",
      "QGA: Flohr, 5.Nc3 c6",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 Be6 Nc3 c6"
    ],
    [
      "D25g",
      "QGA: Janowski-Larsen Variation",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 Bg4"
    ],
    [
      "D25g",
      "QGA: Janowski-Larsen, 5.h3",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 Bg4 h3"
    ],
    [
      "D26a",
      "QGA: 4.e3 e6",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6"
    ],
    [
      "D26b",
      "QGA: 4.e3 e6 5.Bxc4",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4"
    ],
    [
      "D26c",
      "QGA: 4.e3 e6 5.Bxc4 a6",
      "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 a6"
    ],
    [
      "D30a",
      "Queen's Gambit Declined (QGD)",
      "d4 d5 c4 e6"
    ],
    [
      "D30a",
      "QGD: 3.e3",
      "d4 d5 c4 e6 e3"
    ],
    [
      "D30b",
      "Diemer-Duhm Gambit (DDG)",
      "d4 d5 c4 e6 e4"
    ],
    [
      "D30b",
      "Diemer-Duhm Gambit (DDG) Accepted",
      "d4 d5 c4 e6 e4 dxe4"
    ],
    [
      "D30b",
      "Diemer-Duhm Gambit (DDG): 4...f5",
      "e4 e6 d4 d5 c4 dxe4 Nc3 f5"
    ],
    [
      "D30c",
      "QGD: 3.g3",
      "d4 d5 c4 e6 g3"
    ],
    [
      "D30d",
      "QGD: 3.cxd5",
      "d4 d5 c4 e6 cxd5"
    ],
    [
      "D30d",
      "QGD: 3.cxd5",
      "d4 d5 c4 e6 cxd5 exd5"
    ],
    [
      "D30d",
      "QGD: 3.cxd5",
      "d4 d5 c4 e6 cxd5 exd5 Nc3"
    ],
    [
      "D30e",
      "QGD: 3.Bf4",
      "d4 d5 c4 e6 Bf4"
    ],
    [
      "D30f",
      "QGD: 3.Nf3",
      "d4 d5 c4 e6 Nf3"
    ],
    [
      "D30g",
      "QGD: 3.Nf3 Nbd7 (Westphalia)",
      "d4 d5 c4 e6 Nf3 Nbd7"
    ],
    [
      "D30h",
      "QGD: Tarrasch without Nc3",
      "d4 d5 c4 e6 Nf3 c5"
    ],
    [
      "D30h",
      "QGD: Tarrasch without Nc3: 4.e3",
      "d4 d5 c4 e6 Nf3 c5 e3"
    ],
    [
      "D30h",
      "QGD: Tarrasch without Nc3: 4.e3 Nf6",
      "d4 d5 c4 e6 Nf3 c5 e3 Nf6"
    ],
    [
      "D30h",
      "QGD: Tarrasch without Nc3",
      "d4 d5 c4 e6 Nf3 c5 cxd5"
    ],
    [
      "D30h",
      "QGD: Tarrasch without Nc3",
      "d4 d5 c4 e6 Nf3 c5 cxd5 exd5"
    ],
    [
      "D30j",
      "QGD: 3.Nf3 c6",
      "d4 d5 c4 e6 Nf3 c6"
    ],
    [
      "D30k",
      "QGD: 3.Nf3 c6 4.e3",
      "d4 d5 c4 e6 Nf3 c6 e3"
    ],
    [
      "D30l",
      "QGD: 3.Nf3 c6 4.Nbd2",
      "d4 d5 c4 e6 Nf3 c6 Nbd2"
    ],
    [
      "D30m",
      "QGD: 3.Nf3 c6 4.Qc2",
      "d4 d5 c4 e6 Nf3 c6 Qc2"
    ],
    [
      "D30n",
      "QGD: 3.Nf3 c6 4.Qc2 Nf6",
      "d4 d5 c4 e6 Nf3 c6 Qc2 Nf6"
    ],
    [
      "D30p",
      "QGD: 3.Nf3 c6 4.Qc2 Nf6 5.g3",
      "d4 d5 c4 e6 Nf3 c6 Qc2 Nf6 g3"
    ],
    [
      "D30q",
      "QGD: 3.Nf3 Nf6",
      "d4 d5 c4 e6 Nf3 Nf6"
    ],
    [
      "D30r",
      "QGD: 3.Nf3 Nf6 4.e3",
      "d4 d5 c4 e6 Nf3 Nf6 e3"
    ],
    [
      "D30s",
      "QGD: 3.Nf3 Nf6 4.e3 c6",
      "d4 d5 c4 e6 Nf3 Nf6 e3 c6"
    ],
    [
      "D30t",
      "QGD: Spielmann Variation",
      "d4 d5 c4 e6 Nf3 Nf6 e3 c6 Nbd2 g6"
    ],
    [
      "D30v",
      "QGD: 3.Nf3 Nf6 4.Bg5",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5"
    ],
    [
      "D30v",
      "QGD: 3.Nf3 Nf6 4.Bg5 dxc4",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5 dxc4"
    ],
    [
      "D30v",
      "QGD: Vienna Variation",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5 Bb4+"
    ],
    [
      "D30v",
      "QGD: 3.Nf3 Nf6 4.Bg5 Nbd7",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5 Nbd7"
    ],
    [
      "D30w",
      "QGD: Capablanca-Duras Variation",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5 h6"
    ],
    [
      "D30x",
      "QGD: 3.Nf3 Nf6 4.Bg5 Be7",
      "d4 d5 c4 e6 Nf3 Nf6 Bg5 Be7"
    ],
    [
      "D31a",
      "QGD: 3.Nc3",
      "d4 d5 c4 e6 Nc3"
    ],
    [
      "D31a",
      "QGD: 3.Nc3 Nc6",
      "d4 d5 c4 e6 Nc3 Nc6"
    ],
    [
      "D31a",
      "QGD: Alapin Variation",
      "d4 d5 c4 e6 Nc3 b6"
    ],
    [
      "D31b",
      "QGD: Janowski Variation",
      "d4 d5 c4 e6 Nc3 a6"
    ],
    [
      "D31c",
      "QGD: 3.Nc3 Bb4",
      "d4 d5 c4 e6 Nc3 Bb4"
    ],
    [
      "D31c",
      "QGD: 3.Nc3 Bb4 4.a3",
      "d4 d5 c4 e6 Nc3 Bb4 a3"
    ],
    [
      "D31d",
      "QGD: Alatortsev Variation",
      "d4 d5 c4 e6 Nc3 Be7"
    ],
    [
      "D31d",
      "QGD: Alatortsev, 4.Nf3",
      "d4 d5 c4 e6 Nc3 Be7 Nf3"
    ],
    [
      "D31d",
      "QGD: Alatortsev, 4.Bf4",
      "d4 d5 c4 e6 Nc3 Be7 Bf4"
    ],
    [
      "D31e",
      "QGD: Alatortsev, Exchange",
      "d4 d5 c4 e6 Nc3 Be7 cxd5"
    ],
    [
      "D31e",
      "QGD: Alatortsev, Exchange",
      "d4 d5 c4 e6 Nc3 Be7 cxd5 exd5"
    ],
    [
      "D31e",
      "QGD: Alatortsev, 5.Bf4",
      "d4 d5 c4 e6 Nc3 Be7 cxd5 exd5 Bf4"
    ],
    [
      "D31i",
      "Semi-Slav",
      "d4 d5 c4 e6 Nc3 c6"
    ],
    [
      "D31j",
      "Semi-Slav: 4.cxd5",
      "d4 d5 c4 e6 Nc3 c6 cxd5"
    ],
    [
      "D31j",
      "Semi-Slav: 4.cxd5",
      "d4 d5 c4 e6 Nc3 c6 cxd5 exd5"
    ],
    [
      "D31n",
      "Semi-Slav: 4.e3",
      "d4 d5 c4 e6 Nc3 c6 e3"
    ],
    [
      "D31o",
      "Semi-Slav: 4.e3 Nf6",
      "d4 d5 c4 e6 Nc3 c6 e3 Nf6"
    ],
    [
      "D31p",
      "Semi-Slav: 4.Nf3",
      "d4 d5 c4 e6 Nc3 c6 Nf3"
    ],
    [
      "D31q",
      "Semi-Slav: Noteboom Variation",
      "d4 d5 c4 e6 Nc3 c6 Nf3 dxc4"
    ],
    [
      "D31r",
      "Semi-Slav: Noteboom, 5.a4",
      "d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 a4"
    ],
    [
      "D31w",
      "Semi-Slav: Marshall Gambit",
      "d4 d5 c4 e6 Nc3 c6 e4"
    ],
    [
      "D31w",
      "Semi-Slav: Marshall Gambit, 4...Bb4",
      "d4 d5 c4 e6 Nc3 c6 e4 Bb4"
    ],
    [
      "D32a",
      "QGD Tarrasch",
      "d4 d5 c4 e6 Nc3 c5"
    ],
    [
      "D32a",
      "QGD Tarrasch: 4.e3",
      "d4 d5 c4 e6 Nc3 c5 e3"
    ],
    [
      "D32b",
      "QGD Tarrasch: 4.Nf3",
      "d4 d5 c4 e6 Nc3 c5 Nf3"
    ],
    [
      "D32j",
      "QGD Tarrasch: 4.cxd5 exd5",
      "d4 d5 c4 e6 Nc3 c5 cxd5 exd5"
    ],
    [
      "D32m",
      "QGD Tarrasch: 5.Nf3",
      "d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3"
    ],
    [
      "D35a",
      "QGD: 3.Nc3 Nf6",
      "d4 d5 c4 e6 Nc3 Nf6"
    ],
    [
      "D35a",
      "QGD: 3.Nc3 Nf6 4.e3",
      "d4 d5 c4 e6 Nc3 Nf6 e3"
    ],
    [
      "D35a",
      "QGD: Harrwitz Attack",
      "d4 d5 c4 e6 Nc3 Nf6 Bf4"
    ],
    [
      "D35a",
      "QGD: Catalan without Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 g3"
    ],
    [
      "D35b",
      "QGD: Exchange",
      "d4 d5 c4 e6 Nc3 Nf6 cxd5"
    ],
    [
      "D35b",
      "QGD: Exchange, 4...Nxd5",
      "d4 d5 c4 e6 Nc3 Nf6 cxd5 Nxd5"
    ],
    [
      "D35b",
      "QGD: Exchange",
      "d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5"
    ],
    [
      "D35d",
      "QGD: Exchange, 5.Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Nf3"
    ],
    [
      "D37a",
      "QGD: 4.Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3"
    ],
    [
      "D37d",
      "QGD: 4.Nf3 Be7",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7"
    ],
    [
      "D37e",
      "QGD: 4.Nf3 Be7 5.e3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 e3"
    ],
    [
      "D37f",
      "QGD: 4.Nf3 Be7 5.e3 O-O",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 e3 O-O"
    ],
    [
      "D37h",
      "QGD: Classical Variation",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4"
    ],
    [
      "D37i",
      "QGD: Classical, 5...O-O",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4 O-O"
    ],
    [
      "D38a",
      "QGD: Ragozin",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4"
    ],
    [
      "D38b",
      "QGD: Ragozin, 5.Qa4+",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 Qa4+"
    ],
    [
      "D38e",
      "QGD: Ragozin, 5.cxd5",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 cxd5"
    ],
    [
      "D38h",
      "QGD: Ragozin, 5.Bg5",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 Bg5"
    ],
    [
      "D38l",
      "QGD: Ragozin, 5.Bg5 h6",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 Bg5 h6"
    ],
    [
      "D40a",
      "QGD: Semi-Tarrasch",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c5"
    ],
    [
      "D40a",
      "QGD: Semi-Tarrasch, 5.e3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 e3"
    ],
    [
      "D41a",
      "QGD: Semi-Tarrasch, 5.cxd5",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 cxd5"
    ],
    [
      "D43a",
      "Semi-Slav",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6"
    ],
    [
      "D43b",
      "Semi-Slav: 5.g3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 g3"
    ],
    [
      "D43c",
      "Semi-Slav: 5.Qd3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 Qd3"
    ],
    [
      "D43d",
      "Semi-Slav: 5.Qb3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 Qb3"
    ],
    [
      "D45a",
      "Semi-Slav: 5.e3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3"
    ],
    [
      "D45b",
      "Semi-Slav: 5.e3 Bd6",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3 Bd6"
    ],
    [
      "D45c",
      "Semi-Slav: 5.e3 Be7",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3 Be7"
    ],
    [
      "D45d",
      "Semi-Slav: 5.e3 Ne4",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3 Ne4"
    ],
    [
      "D45f",
      "Semi-Slav: 5.e3 Nbd7",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3 Nbd7"
    ],
    [
      "D46a",
      "Semi-Slav: 6.Bd3",
      "d4 d5 c4 e6 Nc3 Nf6 Nf3 c6 e3 Nbd7 Bd3"
    ],
    [
      "D50",
      "QGD: 4.Bg5",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5"
    ],
    [
      "D50",
      "QGD: 4.Bg5 c6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 c6"
    ],
    [
      "D50",
      "QGD: 4.Bg5 dxc4",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 dxc4"
    ],
    [
      "D50",
      "QGD: 4.Bg5 Bb4",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Bb4"
    ],
    [
      "D50",
      "QGD: Dutch-Peruvian Gambit",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 c5"
    ],
    [
      "D50",
      "QGD: Dutch-Peruvian, 5.cxd5",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 c5 cxd5"
    ],
    [
      "D51",
      "QGD: 4.Bg5 Nbd7",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7"
    ],
    [
      "D51",
      "QGD: 4.Bg5 Nbd7 5.Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 Nf3"
    ],
    [
      "D51",
      "QGD: 4.Bg5 Nbd7 5.Nf3 c6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 Nf3 c6"
    ],
    [
      "D51",
      "QGD: 4.Bg5 Nbd7 5.e3",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3"
    ],
    [
      "D51",
      "QGD: 4.Bg5 Nbd7 5.e3 c6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6"
    ],
    [
      "D53a",
      "QGD: 4.Bg5 Be7",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7"
    ],
    [
      "D53c",
      "QGD: 4.Bg5 Be7 5.Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 Nf3"
    ],
    [
      "D53d",
      "QGD: 4.Bg5 Be7 5.Nf3 h6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 Nf3 h6"
    ],
    [
      "D53p",
      "QGD: 4.Bg5 Be7 5.e3",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3"
    ],
    [
      "D53t",
      "QGD: 4.Bg5 Be7 5.e3 h6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 h6"
    ],
    [
      "D53u",
      "QGD: 4.Bg5 Be7 5.e3 O-O",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O"
    ],
    [
      "D55a",
      "QGD: 6.Nf3",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3"
    ],
    [
      "D55c",
      "QGD: 6.Nf3 b6",
      "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 b6"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 3.Nf3 d5",
      "d4 Nf6 c4 g6 Nf3 d5"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: Alekhine's Anti-Gr\u00fcnfeld",
      "d4 Nf6 c4 g6 f3 d5"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 3.g3 d5",
      "d4 Nf6 c4 g6 g3 d5"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 4.cxd5",
      "d4 Nf6 c4 g6 g3 d5 cxd5"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 4.Bg2",
      "d4 Nf6 c4 g6 g3 d5 Bg2"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 4.Bg2 c6",
      "d4 Nf6 c4 g6 g3 d5 Bg2 c6"
    ],
    [
      "D70",
      "Neo-Gr\u00fcnfeld: 4.Bg2 Bg7",
      "d4 Nf6 c4 g6 g3 d5 Bg2 Bg7"
    ],
    [
      "D73",
      "Neo-Gr\u00fcnfeld, 5.Nf3",
      "d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 Nf3"
    ],
    [
      "D73",
      "Neo-Gr\u00fcnfeld, 5.Nf3 c6",
      "d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 Nf3 c6"
    ],
    [
      "D73",
      "Neo-Gr\u00fcnfeld, 5.Nf3 c5",
      "d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 Nf3 c5"
    ],
    [
      "D73",
      "Neo-Gr\u00fcnfeld, 5.Nf3 O-O",
      "d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 Nf3 O-O"
    ],
    [
      "D80",
      "Gr\u00fcnfeld Defence",
      "d4 Nf6 c4 g6 Nc3 d5"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: Spike/Gibbon Gambit",
      "d4 Nf6 c4 g6 Nc3 d5 g4"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.h4",
      "d4 Nf6 c4 g6 Nc3 d5 h4"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.g3",
      "d4 Nf6 c4 g6 Nc3 d5 g3"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.f3",
      "d4 Nf6 c4 g6 Nc3 d5 f3"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.e3",
      "d4 Nf6 c4 g6 Nc3 d5 e3"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.e3 Bg7",
      "d4 Nf6 c4 g6 Nc3 d5 e3 Bg7"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: 4.e3 Bg7 5.Qb3",
      "d4 Nf6 c4 g6 Nc3 d5 e3 Bg7 Qb3"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: Stockholm Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Bg5"
    ],
    [
      "D80",
      "Gr\u00fcnfeld: Stockholm, 4...Ne4",
      "d4 Nf6 c4 g6 Nc3 d5 Bg5 Ne4"
    ],
    [
      "D81",
      "Gr\u00fcnfeld: Early Russian Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Qb3"
    ],
    [
      "D82",
      "Gr\u00fcnfeld: 4.Bf4",
      "d4 Nf6 c4 g6 Nc3 d5 Bf4"
    ],
    [
      "D82",
      "Gr\u00fcnfeld: 4.Bf4 Bg7",
      "d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7"
    ],
    [
      "D82",
      "Gr\u00fcnfeld: 4.Bf4 Bg7 5.e3",
      "d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3"
    ],
    [
      "D85a",
      "Gr\u00fcnfeld: Exchange Variation",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5"
    ],
    [
      "D85a",
      "Gr\u00fcnfeld: Exchange Variation",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5"
    ],
    [
      "D85a",
      "Gr\u00fcnfeld: Exchange, 5.g3",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 g3"
    ],
    [
      "D85a",
      "Gr\u00fcnfeld: Exchange, 5.Na4",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 Na4"
    ],
    [
      "D85b",
      "Gr\u00fcnfeld: Exchange, 5.Bd2",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 Bd2"
    ],
    [
      "D85d",
      "Gr\u00fcnfeld: Exchange, 5.e4",
      "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Three Knights Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Schlechter Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 c6"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Schlechter, 5.Qb3",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 c6 Qb3"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Three Knights Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Three Knights, 5.g3",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 g3"
    ],
    [
      "D90",
      "Gr\u00fcnfeld: Flohr Variation",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qa4+"
    ],
    [
      "D91a",
      "Gr\u00fcnfeld: 5.Bg5",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5"
    ],
    [
      "D91a",
      "Gr\u00fcnfeld: 5.Bg5 c6",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5 c6"
    ],
    [
      "D91b",
      "Gr\u00fcnfeld: 5.Bg5 dxc4",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5 dxc4"
    ],
    [
      "D91d",
      "Gr\u00fcnfeld: 5.Bg5 Ne4",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5 Ne4"
    ],
    [
      "D92",
      "Gr\u00fcnfeld: 5.Bf4",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bf4"
    ],
    [
      "D92",
      "Gr\u00fcnfeld: 5.Bf4 c6",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bf4 c6"
    ],
    [
      "D92",
      "Gr\u00fcnfeld: 5.Bf4 O-O",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bf4 O-O"
    ],
    [
      "D94",
      "Gr\u00fcnfeld: 5.e3",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3"
    ],
    [
      "D94",
      "Gr\u00fcnfeld: Slav/Schlecter",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 c6"
    ],
    [
      "D94",
      "Gr\u00fcnfeld: 5.e3 O-O",
      "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O"
    ],
    [
      "E00a",
      "Queen's Pawn: Neo-Indian",
      "d4 Nf6 c4 e6"
    ],
    [
      "E00a",
      "Queen's Pawn: Neo-Indian, Devin Gambit",
      "d4 Nf6 c4 e6 g4"
    ],
    [
      "E00b",
      "Queen's Pawn: Anti-Nimzo-Indian",
      "d4 Nf6 c4 e6 a3"
    ],
    [
      "E00b",
      "Queen's Pawn: Anti-Nimzo-Indian, 3...d5",
      "d4 Nf6 c4 e6 a3 d5"
    ],
    [
      "E00c",
      "Neo-Indian (Seirawan) Attack",
      "d4 Nf6 c4 e6 Bg5"
    ],
    [
      "E00d",
      "Queen's Pawn: Neo-Indian",
      "d4 Nf6 c4 e6 Nc3"
    ],
    [
      "E00e",
      "Queen's Pawn: Neo-Indian, 3...b6",
      "d4 Nf6 c4 e6 Nc3 b6"
    ],
    [
      "E00e",
      "Queen's Pawn: Neo-Indian, 3...b6",
      "d4 Nf6 c4 e6 Nc3 b6 e4"
    ],
    [
      "E00f",
      "Queen's Pawn: Neo-Indian, 3...c5",
      "d4 Nf6 c4 e6 Nc3 c5"
    ],
    [
      "E00g",
      "Catalan",
      "d4 Nf6 c4 e6 g3"
    ],
    [
      "E00g",
      "Catalan: Hungarian Gambit",
      "d4 Nf6 c4 e6 g3 e5"
    ],
    [
      "E00g",
      "Catalan: 3...c6",
      "d4 Nf6 c4 e6 g3 c6"
    ],
    [
      "E00h",
      "Catalan: 3...c5",
      "d4 Nf6 c4 e6 g3 c5"
    ],
    [
      "E00h",
      "Catalan: 3...c5 4.Nf3",
      "d4 Nf6 c4 e6 g3 c5 Nf3"
    ],
    [
      "E00i",
      "Catalan: 3...Bb4+",
      "d4 Nf6 c4 e6 g3 Bb4+"
    ],
    [
      "E00i",
      "Catalan: 3...Bb4+ 4.Nd2",
      "d4 Nf6 c4 e6 g3 Bb4+ Nd2"
    ],
    [
      "E00j",
      "Catalan: 3...Bb4+ 4.Bd2",
      "d4 Nf6 c4 e6 g3 Bb4+ Bd2"
    ],
    [
      "E00k",
      "Catalan: 3...Bb4+ 4.Bd2 Bxd2+",
      "d4 Nf6 c4 e6 g3 Bb4+ Bd2 Bxd2+"
    ],
    [
      "E00l",
      "Catalan: 3...Bb4+ 4.Bd2 Be7",
      "d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7"
    ],
    [
      "E00m",
      "Catalan: 3...Bb4+ 4.Bd2 Qe7",
      "d4 Nf6 c4 e6 g3 Bb4+ Bd2 Qe7"
    ],
    [
      "E00n",
      "Catalan: 3...d5",
      "d4 Nf6 c4 e6 g3 d5"
    ],
    [
      "E00o",
      "Catalan: 4.Nf3",
      "d4 Nf6 c4 e6 g3 d5 Nf3"
    ],
    [
      "E00p",
      "Catalan: 4.Nf3 c6",
      "d4 Nf6 c4 e6 g3 d5 Nf3 c6"
    ],
    [
      "E00q",
      "Catalan: 4.Nf3 c5",
      "d4 Nf6 c4 e6 g3 d5 Nf3 c5"
    ],
    [
      "E00r",
      "Catalan: 4.Nf3 Bb4+",
      "d4 Nf6 c4 e6 g3 d5 Nf3 Bb4+"
    ],
    [
      "E00r",
      "Catalan: 4.Nf3 Bb4+ 5.Bd2",
      "d4 Nf6 c4 e6 g3 d5 Nf3 Bb4+ Bd2"
    ],
    [
      "E00s",
      "Catalan: 4.Nf3 Be7",
      "d4 Nf6 c4 e6 g3 d5 Nf3 Be7"
    ],
    [
      "E00t",
      "Catalan: 4.Nf3 dxc4",
      "d4 Nf6 c4 e6 g3 d5 Nf3 dxc4"
    ],
    [
      "E01",
      "Catalan: 4.Bg2",
      "d4 Nf6 c4 e6 g3 d5 Bg2"
    ],
    [
      "E01",
      "Catalan: 4...Bb4+",
      "d4 Nf6 c4 e6 g3 d5 Bg2 Bb4+"
    ],
    [
      "E01",
      "Catalan: 4...Bb4+ 5.Bd2",
      "d4 Nf6 c4 e6 g3 d5 Bg2 Bb4+ Bd2"
    ],
    [
      "E01",
      "Catalan: 4...Bb4+ 5.Nd2",
      "d4 Nf6 c4 e6 g3 d5 Bg2 Bb4+ Nd2"
    ],
    [
      "E01",
      "Catalan: 4...c6",
      "d4 Nf6 c4 e6 g3 d5 Bg2 c6"
    ],
    [
      "E01",
      "Catalan: 4...c6 5.Qc2",
      "d4 Nf6 c4 e6 g3 d5 Bg2 c6 Qc2"
    ],
    [
      "E01",
      "Catalan: 4...c6 5.Nf3",
      "d4 Nf6 c4 e6 g3 d5 Bg2 c6 Nf3"
    ],
    [
      "E01",
      "Catalan: 4...c5",
      "d4 Nf6 c4 e6 g3 d5 Bg2 c5"
    ],
    [
      "E01",
      "Catalan: 4...c5 5.Nf3",
      "d4 Nf6 c4 e6 g3 d5 Bg2 c5 Nf3"
    ],
    [
      "E01",
      "Catalan: Open",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4"
    ],
    [
      "E02",
      "Catalan: Open, 5.Qa4+",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4+"
    ],
    [
      "E04a",
      "Catalan: Open, 5.Nf3",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3"
    ],
    [
      "E04d",
      "Catalan: Open, 5.Nf3 b5",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 b5"
    ],
    [
      "E04e",
      "Catalan: Open, 5.Nf3 a6",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 a6"
    ],
    [
      "E04k",
      "Catalan: Open, 5.Nf3 c5",
      "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 c5"
    ],
    [
      "E06",
      "Catalan: Closed",
      "d4 Nf6 c4 e6 g3 d5 Bg2 Be7"
    ],
    [
      "E06",
      "Catalan: Closed, 5.Nf3",
      "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3"
    ],
    [
      "E10a",
      "Neo-Indian: 3.Nf3",
      "d4 Nf6 c4 e6 Nf3"
    ],
    [
      "E10b",
      "Neo-Indian: D\u00f6ry Defence",
      "d4 Nf6 c4 e6 Nf3 Ne4"
    ],
    [
      "E10c",
      "Neo-Indian: 3.Nf3 Be7",
      "d4 Nf6 c4 e6 Nf3 Be7"
    ],
    [
      "E10d",
      "Neo-Indian: 3.Nf3 a6",
      "d4 Nf6 c4 e6 Nf3 a6"
    ],
    [
      "E10e",
      "Neo-Indian: 3.Nf3 a6 4.Nc3",
      "d4 Nf6 c4 e6 Nf3 a6 Nc3"
    ],
    [
      "E10f",
      "Neo-Indian: 3.Nf3 a6 4.Nc3 c5",
      "d4 Nf6 c4 e6 Nf3 a6 Nc3 c5"
    ],
    [
      "E10g",
      "Neo-Indian: Blumenfeld/Benoni",
      "d4 Nf6 c4 e6 Nf3 c5"
    ],
    [
      "E10h",
      "Neo-Indian: Blumenfeld/Benoni, 4.e3",
      "d4 Nf6 c4 e6 Nf3 c5 e3"
    ],
    [
      "E10k",
      "Blumenfeld Countergambit",
      "d4 Nf6 c4 e6 Nf3 c5 d5 b5"
    ],
    [
      "E10k",
      "Blumenfeld: 5.dxe6",
      "d4 Nf6 c4 e6 Nf3 c5 d5 b5 dxe6"
    ],
    [
      "E11a",
      "Bogo-Indian",
      "d4 Nf6 c4 e6 Nf3 Bb4+"
    ],
    [
      "E11a",
      "Bogo-Indian: 4.Nbd2",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2"
    ],
    [
      "E11b",
      "Bogo-Indian: 4.Nbd2 d5",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 d5"
    ],
    [
      "E11c",
      "Bogo-Indian: 4.Nbd2 b6",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 b6"
    ],
    [
      "E11e",
      "Bogo-Indian: 4.Nbd2 O-O",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 O-O"
    ],
    [
      "E11g",
      "Bogo-Indian: 4.Bd2",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2"
    ],
    [
      "E11g",
      "Bogo-Indian: 4.Bd2 Be7",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Be7"
    ],
    [
      "E11j",
      "Bogo-Indian: Vitolins Variation",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 c5"
    ],
    [
      "E11l",
      "Bogo-Indian: 4.Bd2 a5",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 a5"
    ],
    [
      "E11m",
      "Bogo-Indian: 4.Bd2 a5 5.g3",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 a5 g3"
    ],
    [
      "E11x",
      "Bogo-Indian: 4.Bd2 Bxd2+",
      "d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Bxd2+"
    ],
    [
      "E12a",
      "Queen's Indian",
      "d4 Nf6 c4 e6 Nf3 b6"
    ],
    [
      "E12b",
      "Queen's Indian: Miles Variation",
      "d4 Nf6 c4 e6 Nf3 b6 Bf4"
    ],
    [
      "E12d",
      "Queen's Indian: Petrosian",
      "d4 Nf6 c4 e6 Nf3 b6 a3"
    ],
    [
      "E12e",
      "Queen's Indian: Petrosian, 4...c5",
      "d4 Nf6 c4 e6 Nf3 b6 a3 c5"
    ],
    [
      "E12v",
      "Queen's Indian: 4.Bg5",
      "d4 Nf6 c4 e6 Nf3 b6 Bg5"
    ],
    [
      "E12w",
      "Queen's Indian: 4.Nc3",
      "d4 Nf6 c4 e6 Nf3 b6 Nc3"
    ],
    [
      "E12w",
      "Queen's Indian: 4.Nc3 Bb7",
      "d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb7"
    ],
    [
      "E14a",
      "Queen's Indian: 4.e3",
      "d4 Nf6 c4 e6 Nf3 b6 e3"
    ],
    [
      "E14a",
      "Queen's Indian: 4.e3 Bb4+",
      "d4 Nf6 c4 e6 Nf3 b6 e3 Bb4+"
    ],
    [
      "E14b",
      "Queen's Indian: 4.e3 Bb7",
      "d4 Nf6 c4 e6 Nf3 b6 e3 Bb7"
    ],
    [
      "E15a",
      "Queen's Indian: 4.g3",
      "d4 Nf6 c4 e6 Nf3 b6 g3"
    ],
    [
      "E15b",
      "Queen's Indian: 4.g3 Bb4+",
      "d4 Nf6 c4 e6 Nf3 b6 g3 Bb4+"
    ],
    [
      "E15b",
      "Queen's Indian: 4.g3 Bb4+",
      "d4 Nf6 c4 e6 Nf3 b6 g3 Bb4+ Bd2"
    ],
    [
      "E15t",
      "Queen's Indian: 4.g3 Bb7",
      "d4 Nf6 c4 e6 Nf3 b6 g3 Bb7"
    ],
    [
      "E15t",
      "Queen's Indian: 4.g3 Bb7",
      "d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2"
    ],
    [
      "E20",
      "Nimzo-Indian Defence",
      "d4 Nf6 c4 e6 Nc3 Bb4"
    ],
    [
      "E20",
      "Nimzo-Indian: Mikenas Attack",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qd3"
    ],
    [
      "E20",
      "Nimzo-Indian: 4.Bd2",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bd2"
    ],
    [
      "E20",
      "Nimzo-Indian: 4.Bd2 O-O",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bd2 O-O"
    ],
    [
      "E20",
      "Nimzo-Indian: Romanishin",
      "d4 Nf6 c4 e6 Nc3 Bb4 g3"
    ],
    [
      "E20",
      "Nimzo-Indian: Romanishin, 4...c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 g3 c5"
    ],
    [
      "E20",
      "Nimzo-Indian: 4.f3 (Kmoch)",
      "d4 Nf6 c4 e6 Nc3 Bb4 f3"
    ],
    [
      "E20",
      "Nimzo-Indian: 4.f3 d5",
      "d4 Nf6 c4 e6 Nc3 Bb4 f3 d5"
    ],
    [
      "E20",
      "Nimzo-Indian: 4.f3 c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 f3 c5"
    ],
    [
      "E21",
      "Nimzo-Indian: Three Knights",
      "d4 Nf6 c4 e6 Nc3 Bb4 Nf3"
    ],
    [
      "E22",
      "Nimzo-Indian: Spielmann Variation",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qb3"
    ],
    [
      "E22",
      "Nimzo-Indian: Spielmann, 4...Nc6",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qb3 Nc6"
    ],
    [
      "E22",
      "Nimzo-Indian: Spielmann, 4...c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5"
    ],
    [
      "E30",
      "Nimzo-Indian: Leningrad",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bg5"
    ],
    [
      "E30",
      "Nimzo-Indian: Leningrad, 4...O-O",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bg5 O-O"
    ],
    [
      "E30",
      "Nimzo-Indian: Leningrad, 4...c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bg5 c5"
    ],
    [
      "E30",
      "Nimzo-Indian: Leningrad, 4...h6",
      "d4 Nf6 c4 e6 Nc3 Bb4 Bg5 h6"
    ],
    [
      "E32a",
      "Nimzo-Indian: Classical Variation",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2"
    ],
    [
      "E32b",
      "Nimzo-Indian: Classical, 4...b6",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 b6"
    ],
    [
      "E32c",
      "Nimzo-Indian: Classical, 4...d6",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d6"
    ],
    [
      "E32d",
      "Nimzo-Indian: Classical, 4...O-O",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O"
    ],
    [
      "E33",
      "Nimzo-Indian: Classical, 4...Nc6",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 Nc6"
    ],
    [
      "E38a",
      "Nimzo-Indian: Classical, 4...c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 c5"
    ],
    [
      "E40",
      "Nimzo-Indian: Rubinstein",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3"
    ],
    [
      "E41",
      "Nimzo-Indian: 4.e3 c5",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3 c5"
    ],
    [
      "E41",
      "Nimzo-Indian: 4.e3 c5 5.Nf3",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Nf3"
    ],
    [
      "E41",
      "Nimzo-Indian: 4.e3 c5 5.Bd3",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3"
    ],
    [
      "E46",
      "Nimzo-Indian: 4.e3 O-O",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O"
    ],
    [
      "E47",
      "Nimzo-Indian: 4.e3 O-O 5.Bd3",
      "d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3"
    ],
    [
      "E60a",
      "King's Indian",
      "d4 Nf6 c4 g6"
    ],
    [
      "E60a",
      "King's Indian: Mengarini Attack",
      "d4 Nf6 c4 g6 Qc2"
    ],
    [
      "E60b",
      "King's Indian: 3.Bg5",
      "d4 Nf6 c4 g6 Bg5"
    ],
    [
      "E60c",
      "King's Indian: 3.d5",
      "d4 Nf6 c4 g6 d5"
    ],
    [
      "E60c",
      "King's Indian: 3.d5, Danube/Adorjan Gambit",
      "d4 Nf6 c4 g6 d5 b5"
    ],
    [
      "E60d",
      "King's Indian: 3.f3",
      "d4 Nf6 c4 g6 f3"
    ],
    [
      "E60e",
      "King's Indian: 3.g3",
      "d4 Nf6 c4 g6 g3"
    ],
    [
      "E60e",
      "King's Indian: 3.g3",
      "d4 Nf6 c4 g6 g3 Bg7"
    ],
    [
      "E60e",
      "King's Indian: 3.g3",
      "d4 Nf6 c4 g6 g3 Bg7 Bg2"
    ],
    [
      "E60e",
      "King's Indian: 3.g3",
      "d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O"
    ],
    [
      "E60f",
      "King's Indian: 3.Nf3",
      "d4 Nf6 c4 g6 Nf3"
    ],
    [
      "E60f",
      "King's Indian: 3.Nf3 d6",
      "d4 Nf6 c4 g6 Nf3 d6"
    ],
    [
      "E60g",
      "King's Indian: 3.Nf3 Bg7",
      "d4 Nf6 c4 g6 Nf3 Bg7"
    ],
    [
      "E60h",
      "King's Indian: b3 System",
      "d4 Nf6 c4 g6 Nf3 Bg7 b3"
    ],
    [
      "E60h",
      "King's Indian: b3 System",
      "d4 Nf6 c4 g6 Nf3 Bg7 b3 O-O Bb2"
    ],
    [
      "E60h",
      "King's Indian: b3 System",
      "d4 Nf6 c4 g6 Nf3 Bg7 b3 d6 Bb2"
    ],
    [
      "E60h",
      "King's Indian: b3 System",
      "d4 Nf6 c4 g6 Nf3 Bg7 b3 d6 Bb2 O-O"
    ],
    [
      "E60j",
      "King's Indian: Fianchetto",
      "d4 Nf6 c4 g6 Nf3 Bg7 g3"
    ],
    [
      "E60j",
      "King's Indian: Fianchetto",
      "d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O"
    ],
    [
      "E61a",
      "King's Indian: 3.Nc3",
      "d4 Nf6 c4 g6 Nc3"
    ],
    [
      "E61a",
      "King's Indian: 3.Nc3 c5",
      "d4 Nf6 c4 g6 Nc3 c5"
    ],
    [
      "E61a",
      "King's Indian: 3.Nc3 c6",
      "d4 Nf6 c4 g6 Nc3 c6"
    ],
    [
      "E61a",
      "King's Indian: 3.Nc3 d6",
      "d4 Nf6 c4 g6 Nc3 d6"
    ],
    [
      "E61b",
      "King's Indian: 3.Nc3 Bg7",
      "d4 Nf6 c4 g6 Nc3 Bg7"
    ],
    [
      "E61b",
      "King's Indian: 4.Bf4",
      "d4 Nf6 c4 g6 Nc3 Bg7 Bf4"
    ],
    [
      "E61c",
      "King's Indian: 4.Bg5",
      "d4 Nf6 c4 g6 Nc3 Bg7 Bg5"
    ],
    [
      "E61d",
      "King's Indian: 4.Bg5 O-O",
      "d4 Nf6 c4 g6 Nc3 Bg7 Bg5 O-O"
    ],
    [
      "E61f",
      "King's Indian: 4.g3",
      "d4 Nf6 c4 g6 Nc3 Bg7 g3"
    ],
    [
      "E61f",
      "King's Indian: 4.g3 d6",
      "d4 Nf6 c4 g6 Nc3 Bg7 g3 d6"
    ],
    [
      "E61g",
      "King's Indian: 4.g3 O-O",
      "d4 Nf6 c4 g6 Nc3 Bg7 g3 O-O"
    ],
    [
      "E61i",
      "King's Indian: 4.Nf3",
      "d4 Nf6 c4 g6 Nc3 Bg7 Nf3"
    ],
    [
      "E61i",
      "King's Indian: 4.Nf3 d6",
      "d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6"
    ],
    [
      "E61i",
      "King's Indian: 4.Nf3 d6 5.e3",
      "d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 e3"
    ],
    [
      "E61k",
      "King's Indian: 4.Nf3 O-O",
      "d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O"
    ],
    [
      "E70a",
      "King's Indian: 4.e4",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4"
    ],
    [
      "E70b",
      "King's Indian: 4.e4 O-O",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 O-O"
    ],
    [
      "E70c",
      "King's Indian: 4.e4 O-O 5.e5",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 O-O e5"
    ],
    [
      "E70e",
      "King's Indian: 4.e4 d6",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6"
    ],
    [
      "E70f",
      "King's Indian: Kramer",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nge2"
    ],
    [
      "E70j",
      "King's Indian: 4.e4 d6 5.Bd3",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Bd3"
    ],
    [
      "E72",
      "King's Indian: 4.e4 d6 5.g3",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 g3"
    ],
    [
      "E73a",
      "King's Indian: 5.Be2",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2"
    ],
    [
      "E73b",
      "King's Indian: 5.Be2 c5",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 c5"
    ],
    [
      "E73c",
      "King's Indian: 5.Be2 e5",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 e5"
    ],
    [
      "E73f",
      "King's Indian: 5.Be2 O-O",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O"
    ],
    [
      "E90a",
      "King's Indian: 5.Nf3",
      "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3"
    ]
  ]