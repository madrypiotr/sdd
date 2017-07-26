Meteor.methods({
    addImplemTeamDraft: function (newTeam) {

        var id = ImplemTeamDraft.insert({
            nazwa: newTeam[0].nazwa,
            zespol:newTeam[0].zespol,
            idZR:newTeam[0].idZR
        });
        return id;
    },
    removeImplemTeamDraft:function(object){
        ImplemTeamDraft.remove(object);
    },
    updateImplemTeamDraft:function(id,data){
        var id = ImplemTeamDraft.update({_id:id}, {$set: {nazwa: data.nazwa,zespol:data.zespol,idZR:data.idZR}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZRDraft: function (id, czlonkowie) {
        var id = ImplemTeamDraft.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateCzlonkowieNazwaZRDraft: function (id, czlonkowie,nazwa) {
        var id = ImplemTeamDraft.update(id, {$set: {zespol: czlonkowie,nazwa:nazwa}}, {upsert: true});
        return id;
    }
});
