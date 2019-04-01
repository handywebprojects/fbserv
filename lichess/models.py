ATOMIC_TOURNEY_NAME = "AtomicChessBot Blitz Tourney"

def fulltourneyname(tourneyname):
    return tourneyname + " Arena"

FULL_ATOMIC_TOURNEY_NAME = fulltourneyname(ATOMIC_TOURNEY_NAME)

#########################################################

LICHESS_TITLES = [
    "BOT",
    "GM",
    "WGM",
    "IM",
    "WIM",
    "FM",
    "WFM",    
    "CM",
    "WCM",
    "NM",
    "WNM",
    "LM"
]

PERF_TYPES = [
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

PERF_DATA_TYPES = [
    "games",
    "rating"
]

TITLED_COLUMN_TYPES = [
    "number_of_followers",
    "total_games",
    "created_at"
]

#########################################################

def signedintasstr(i):
    if i<0:
        return "{}".format(i)
    return "+{}".format(i)

#########################################################

class Perf:
    def __init__(self, kind, obj):
        self.kind = kind
        self.games = obj.get("games", 0)
        self.rating = obj.get("rating", 1500)
        self.rd = obj.get("rd", 0)
        self.prog = obj.get("prog", 0)

    def __repr__(self):
        return "Lichess perf {}. Content: {}.".format(self.kind, self.__dict__)

class UserProfile:
    def __init__(self, obj):
        self.bio = obj.get("bio", "")

    def __repr__(self):
        return "Lichess user profile. Content: {}.".format(self.__dict__)

class User:
    def __init__(self, obj):
        self.id = obj.get("id", "")
        self.name = obj.get("name", "Anonymous")

    def __repr__(self):
        return "Lichess user. Content: {}.".format(self.__dict__)

class PlayTime:
    def __init__(self, obj):
        self.bio = obj.get("total", 0)
        self.tv = obj.get("tv", 0)

    def __repr__(self):
        return "Lichess play time. Content: {}.".format(self.__dict__)

class Count:
    def __init__(self, obj):
        self.all = obj.get("all", 0)
        self.rated = obj.get("rated", 0)
        self.ai = obj.get("ai", 0)
        self.draw = obj.get("draw", 0)
        self.drawH = obj.get("drawH", 0)
        self.loss = obj.get("loss", 0)
        self.lossH = obj.get("lossH", 0)
        self.win = obj.get("win", 0)
        self.winH = obj.get("winH", 0)
        self.bookmark = obj.get("bookmark", 0)
        self.playing = obj.get("playing", 0)
        self.imports = obj.get("import", 0)
        self.me = obj.get("me", 0)
        
    def __repr__(self):
        return "Lichess count. Content: {}.".format(self.__dict__)

class Player:
    def __init__(self, color, obj):
        self.color = color
        self.user = User(obj.get("user", {}))
        self.rating = obj.get("rating", 1500)
        self.ratingDiff = obj.get("ratingDiff", 0)

    def __repr__(self):
        return "Lichess player. Content: {}.".format(self.__dict__)

    def summary(self):
        return "{} ( {} {} )".format(self.user.name, self.rating, signedintasstr(self.ratingDiff))

class Profile:
    def __init__(self, obj):
        self.id = obj["id"]
        self.username = obj.get("username", "Anonymous")
        self.online = obj.get("online", False)
        self.perfs = {}
        self.perflist = []
        for perfkind, perf in obj.get("perfs", {}).items():
            perfinstance = Perf(perfkind, perf)
            self.perfs[perfkind] = perfinstance
            self.perflist.append(perfinstance)
        self.createdAt = obj.get("createdAt", 0)
        self.profile = UserProfile(obj.get("profile", {}))
        self.seenAt = obj.get("seenAt", 0)
        self.playTime = PlayTime(obj.get("playTime", {}))
        self.language = obj.get("language", "English")
        self.url = obj.get("url", "")
        self.nbFollowing = obj.get("nbFollowing", 0)
        self.nbFollowers = obj.get("nbFollowers", 0)
        self.completionRate = obj.get("completionRate", 0)
        self.count = Count(obj.get("count", {}))

    def __repr__(self):
        return "Lichess profile for id {} username {}. Content: {}.".format(self.id, self.username, self.__dict__)

class Clock:
    def __init__(self, obj):
        self.initial = obj.get("initial", 60)
        self.increment = obj.get("increment", 0)
        self.totalTime = obj.get("totalTime", 0)
        
    def __repr__(self):
        return "Lichess clock. Content: {}.".format(self.__dict__)

    def summary(self):
        return "{} + {}".format(self.initial, self.increment)

class Game:
    def __init__(self, obj):
        self.id = obj.get("id", "")
        self.rated = obj.get("rated", False)
        self.variant = obj.get("variant", "standard")
        self.speed = obj.get("speed", "bullet")
        self.perf = obj.get("perf", "bullet")
        self.createdAt = obj.get("createdAt", 0)
        self.lastMoveAt = obj.get("lastMoveAt", 0)
        self.status = obj.get("status", "unknpwn")
        self.players = {}
        self.playerlist = []
        for color, player in obj.get("players", {}).items():
            playerinstance = Player(color, player)
            self.players[color] = playerinstance
            self.playerlist.append(playerinstance)
        self.winner = obj.get("winner", None)
        self.moves = obj.get("moves", "'")
        self.clock = Clock(obj.get("clock", {}))

    def result(self):
        if self.winner == "white":
            return 1
        if self.winner == "black":
            return 0
        return 0.5

    def resultstr(self):
        if self.result() == 1:
            return "1-0"
        if self.result() == 0:
            return "0-1"
        return "1/2 - 1/2"

    def __repr__(self):
        return "Lichess game. Content: {}.".format(self.__dict__)

    def summary(self):
        return "{} {} {} {} - {} {}".format(self.perf, ["unrated", "rated"][int(self.rated)], self.clock.summary(), self.players["white"].summary(), self.players["black"].summary(), self.resultstr())

#########################################################

for perftype in PERF_TYPES:
    for perfdatatype in PERF_DATA_TYPES:
        TITLED_COLUMN_TYPES.append("{}_{}".format(perftype, perfdatatype))