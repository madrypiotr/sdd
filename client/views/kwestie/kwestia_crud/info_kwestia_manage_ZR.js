Template.ZRTemplate.helpers({
    hasAccess: function () {
        if (!Meteor.userId())
            return 'disabled';
        return Meteor.user().profile.userType == USERTYPE.CZLONEK ? '' : 'disabled';
    },
    getZRName: function (idZR,status) {
        var zespolR = null;
        if (status == KWESTIA_STATUS.REALIZOWANA)
            zespolR = ZespolRealizacyjny.findOne({_id: idZR});
        else
            zespolR = ImplemTeamDraft.findOne({_id:idZR});

        if (zespolR) {
            return zespolR.nazwa;
        }
    },
    isInKoszOrZrealizowana: function (czyAktywny,status) {
        return (
            czyAktywny == false ||
            status == KWESTIA_STATUS.ZREALIZOWANA ||
            status == KWESTIA_STATUS.ARCHIWALNA
        );
    },
    statusGlosowanaOsobowaRealizowanaZrealizowana: function (status,typ,czyAktywny) {
        return (
            status == KWESTIA_STATUS.GLOSOWANA ||
            status == KWESTIA_STATUS.OSOBOWA ||
            status == KWESTIA_STATUS.REALIZOWANA ||
            status == KWESTIA_STATUS.ZREALIZOWANA ||
            status == KWESTIA_STATUS.ARCHIWALNA ||
            czyAktywny == false
        );
    },
    pierwszyCzlonekFullName: function (idZR) {
        return getCzlonekFullName(0,idZR,'ZRDraft');
    },
    drugiCzlonekFullName: function (idZR) {
        return getCzlonekFullName(1,idZR,'ZRDraft');
    },
    trzeciCzlonekFullName: function (idZR) {
        return getCzlonekFullName(2,idZR,'ZRDraft');
    },
    isActualUser: function (index,idZR) {
        var userID = getImplTeamData(index,idZR,'ZRDraft');
        if (userID) {
            if (userID != Meteor.userId())
                return 'disabled';
            return this.status == KWESTIA_STATUS.GLOSOWANA ? 'disabled' : '';
        }
        return 'disabled';
    },
    isInZRFoo: function (idZr) {
        var zrDraft = ZespolRealizacyjny.findOne({_id:idZr});
        if (zrDraft) {
            return _.contains(zrDraft.zespol, Meteor.userId()) ? true : false;
        }
    },
    isInZR: function (idZr) {
        if (Meteor.user().profile.userType !== USERTYPE.CZLONEK)
            return 'disabled';
        var zrDraft = ImplemTeamDraft.findOne({_id:idZr});
        if (zrDraft) {
            return _.contains(zrDraft.zespol, Meteor.userId()) ? 'disabled' : '';
        }
    },
    getZRCzlonkowie: function (idZR,status) {
        var zespol = null;
        var text = null;
        if (status == KWESTIA_STATUS.GLOSOWANA || status == KWESTIA_STATUS.OSOBOWA || status == KWESTIA_STATUS.OCZEKUJACA || status == KWESTIA_STATUS.STATUSOWA) {
            zespol = ImplemTeamDraft.findOne({_id: idZR});
        } else {
            zespol = ZespolRealizacyjny.findOne({_id: idZR});
        }
        var data = [];
        if (zespol) {
            for (var i = 0;i < zespol.zespol && zespol.zespol.length;i++) {
                var user = Users.findOne({_id:zespol.zespol[i]});
                data.push(user.profile.fullName);
            }
        }
        return data;
    },
    getZRMembersTrashCan: function (zespol) {
        // getZRCzlonkowieTrashCan only once here. Check if you need it?
        var data = '';
        _.each(zespol.czlonkowie,function (czlonek) {
            data += czlonek + ',';
        });
        return data;
    },
    myZR: function (zespolArray) {
        var array = [];
        var i = 1;
        zespolArray.forEach(function (czlonek) {
            var obj = {
                member:czlonek,
                number:i
            };
            array.push(obj);
            i++ ;
        });
        return array;
    }
});

Template.ZRTemplate.events({
    'click #czlonek1': function () {
        teamId = this.idZR;
        var idUser = getImplTeamData(0, this.idZR,'ZRDraft');
        if (idUser == Meteor.userId()) {
            unsubscribeITAlert(getImplTeamData(0,teamId,'ZRDraft'), this.idKwestia);
        } else {
            var z = ImplemTeamDraft.findOne({_id: teamId});
            var teamToUpdate = z.zespol.slice();
            if (z.zespol.length > 0) {
                GlobalNotification.error({
                    title: TAPi18n.__('txv.ERROR'),
                    content: TAPi18n.__('txv.FIRST_MEM_IMPL_TEAM_EXIS'),
                    duration: 4
                });
                return false;
            }

            if (addMemberToImplemTeamNotificationNew(Meteor.userId(), teamToUpdate, 2, teamId) == false) {
                bladNotification();
            }
        }
    },
    'click #czlonek2': function () {
        teamId = this.idZR;
        var idUser = checkIfInIT(teamId, Meteor.userId());
        if (idUser == Meteor.userId()) { // That means I'm already in the band and I can give up
            unsubscribeITAlert(checkIfInIT(teamId, Meteor.userId()), this.idKwestia);
        } else {
            var z = ImplemTeamDraft.findOne({_id: teamId});
            var teamToUpdate = z.zespol.slice();
            var liczba = 3 - z.zespol.length - 1;

            if (isUserInImplemTeamNotification(Meteor.userId(), teamToUpdate) == false) {
                if (isUserCountInImplemTeamNotification(Meteor.userId(), teamToUpdate, 2) == false) {
                    if (addMemberToImplemTeamNotificationNew(Meteor.userId(), teamToUpdate, liczba, teamId) == false) {
                        bladNotification();
                    }
                }
            }
        }
    },
    'click #czlonek3': function () {
        teamId = this.idZR;
        var idUser = checkIfInIT(teamId, Meteor.userId());
        if (idUser == Meteor.userId()) {
            unsubscribeITAlert(checkIfInIT(teamId, Meteor.userId()), this.idKwestia);
        } else {
            var z = ImplemTeamDraft.findOne({_id: teamId});
            var teamToUpdate = z.zespol.slice();
            var liczba = 3 - z.zespol.length - 1;

            if (isUserInImplemTeamNotification(Meteor.userId(), teamToUpdate) == false) {//jeżeli nie jest w zespole
                if (isUserCountInImplemTeamNotification(Meteor.userId(), teamToUpdate, 2) == false) {
                    if (addMemberToImplemTeamNotificationNew(Meteor.userId(), teamToUpdate, liczba, teamId) == false) {
                        bladNotification();
                    }
                }
            }
        }
    },
    'click #listaZR': function () {
        $('#listZespolRealizacyjny').modal('show');
    }
});
