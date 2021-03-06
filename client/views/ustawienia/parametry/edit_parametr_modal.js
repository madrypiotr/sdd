Template.editParametrModalInner.rendered = function () {
    $('.successBtn').css('visibility', 'visible');
};

Template.editParametrModalInner.helpers({
    parametrInScope: function () {
        return Session.get('chosenParameterSession');
    },
    nazwaOrganizacjiInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.ORG_NAME');
    },
    terytoriumInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.TERITORY');
    },
    terytAdresInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.TERITADR');
    },
    terytCODEInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.TERITCOD');
    },
    terytCityInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.TERITCITY');
    },
    kontaktInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.CONTACTS');
    },
    statutInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.STATUT');
    },
    voteDurationInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.VOTE_TIME');
    },
    czasWyczekiwaniaKwestiiSpecjalnejInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.WAITING_TIME');
    },
    editVoteQuantityInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.MAX_ISSUE_IN_VOTING');
    },
    editIssuePauseInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.FREQ_ADD_ISSUE');
    },
    editCommentPauseInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.FREQ_ADD_COMM');
    },
    editReferencePauseInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.FREQ_ADD_REFER');
    },
    editRRDurationInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.FREQ_ADD_REPPO');
    },
    editRegStartInput: function (parameterName) {
        return parameterName == TAPi18n.__('txv.regStart');
    }
});

Template.editParametrModalInner.events({
    'click .btn-danger': function (e) {
        e.preventDefault();
        Session.setPersistent('chosenParameterSession', null);
        $('#editParametrMod').modal('hide');
    },
    'submit form': function (e) {
        e.preventDefault();
        if ($('#parametrFormEditModal').valid()) {
            $('.successBtn').css('visibility', 'hidden');
            var odp = checkIssueGlobalParamExists();
            if (odp == true) {
                bootbox.alert(TAPi18n.__('txv.GL_PAR_CHANGE4'));
                $('#editParametrMod').modal('hide');
                document.getElementById('parametrFormEditModal').reset();
            } else {
                var session = Session.get('chosenParameterSession');

                var newValue = document.getElementById('param').value;
                if (newValue == null || newValue.trim() == '') {
                    GlobalNotification.error({
                        title: TAPi18n.__('txv.ERROR'),
                        content: TAPi18n.__('txv.FIELD') + session.title + TAPi18n.__('txv.CAN_NOT_BE_EMPTY'),
                        duration: 4
                    });
                } else {
                    parametrPreview(session.name, session.title, session.value, newValue);
                }
            }
            $('.successBtn').css('visibility', 'visible');
        }

    }
});

var parametrPreview = function (paramName, title, oldValue, newValue) {
    bootbox.dialog({
        message: '<p class="bg-warning padding-15 color-red"><b>' + TAPi18n.__('txv.YOU_INT_CHANGE') + '</b></p>' +
        '<p>' + TAPi18n.__('txv.I_SUGG_CH_CONT') + '<b>' + title.toUpperCase() + '</b>' + TAPi18n.__('txv.WITH_THE_VALUE') + '</p>' +
        '<p>' + oldValue + '</p>' +
        '<p>' + TAPi18n.__('txv.ON') + '</p>' +
        '<p>' + newValue + '</p>',
        title: TAPi18n.__('txv.WARNING'),
        closeButton: false,
        buttons: {
            success: {
                label: TAPi18n.__('txv.I_AGREE'),
                className: 'btn-success successBtn',
                callback: function () {
                    $('.successBtn').css('visibility', 'hidden');
                    var odp = checkIssueGlobalParamExists();
                    var params = ParametrDraft.find({czyAktywny: true});
                    if (odp == true || params.count() > 0) {
                        bootbox.alert(TAPi18n.__('txv.GL_PAR_CHANGE4'));
                        $('#editParametrMod').modal('hide');
                    } else
                        createIssueChangeParam(paramName, title, oldValue, newValue);
                    $('.successBtn').css('visibility', 'visible');
                }
            },
            danger: {
                label: TAPi18n.__('txv.RESIGNS'),
                className: 'btn-danger',
                callback: function () {
                    $('.btn-success2').css('visibility', 'visible');
                }
            }
        }
    });
};

var createIssueChangeParam = function (paramName, title, oldValue, newValue) {
    var params = Parametr.findOne();
    var nazwaOrg = params.nazwaOrganizacji;
    var terytorium = params.terytorium;
    var terytAdres = params.terytAdres;
    var terytCODE = params.terytCODE;
    var terytCity = params.terytCity;
    var kontakty = params.kontakty;
    var reg = params.regulamin;
    var voteDur = params.voteDuration;
    var voteQuan = params.voteQuantity;
    var czasWycz = params.czasWyczekiwaniaKwestiiSpecjalnej;
    var issuePause = params.addIssuePause;
    var commPause = params.addCommentPause;
    var refPause = params.addReferencePause;
    var okresSkladaniaRR = params.okresSkladaniaRR;
    var regStart = params.regStart;

    switch (paramName) {
        case 'nazwaOrganizacji': nazwaOrg = newValue; break;
        case 'terytorium': terytorium = newValue; break;
        case 'terytAdres': terytAdres = newValue; break;
        case 'terytCODE': terytCODE = newValue; break;
        case 'terytCity': terytCity = newValue; break;
        case 'kontakty': kontakty = newValue; break;
        case 'regulamin': reg = newValue; break;
        case 'voteDuration': voteDur = newValue; break;
        case 'voteQuantity': voteQuan = newValue; break;
        case 'czasWyczekiwaniaKwestiiSpecjalnej': czasWycz = newValue; break;
        case 'addIssuePause': issuePause = newValue; break;
        case 'addCommentPause': commPause = newValue; break;
        case 'addReferencePause': refPause = newValue; break;
        case 'okresSkladaniaRR': okresSkladaniaRR = newValue; break;
        case 'regStart': regStart = newValue; break;
    }
    var addParamDraft = {
        nazwaOrganizacji: nazwaOrg,
        terytorium: terytorium,
        terytAdres: terytAdres,
        terytCODE: terytCODE,
        terytCity: terytCity,
        kontakty: kontakty,
        regulamin: reg,
        voteDuration: voteDur,
        voteQuantity: voteQuan,
        czasWyczekiwaniaKwestiiSpecjalnej: czasWycz,
        addIssuePause: issuePause,
        addCommentPause: commPause,
        addReferencePause: refPause,
        okresSkladaniaRR: okresSkladaniaRR,
        regStart: regStart
    };
    var odp = checkIssueGlobalParamExists();
    var params = ParametrDraft.find({czyAktywny: true});
    if (odp == false || params.count() == 0) {
        Meteor.call('addParametrDraft', addParamDraft, function (error, ret) {
            if (!error) {
                var params = ParametrDraft.find({czyAktywny: true});
                if (params.count() > 1) {
                    Meteor.call('setActivityParametrDraft', ret, false);
                } else {
                    var dataParams = {
                        title: title.toUpperCase(),
                        oldValue: oldValue,
                        newValue: newValue
                    };
                    var newKwestia = [{
                        idUser: Meteor.userId(),
                        dataWprowadzenia: new Date(),
                        kwestiaNazwa: TAPi18n.__('txv.GL_PAR_CHANGE5') + Meteor.user().profile.firstName + '  ' + Meteor.user().profile.lastName,
                        wartoscPriorytetu: 0,
                        dataGlosowania: null,
                        krotkaTresc: TAPi18n.__('txv.GL_PAR_CHANGE6'),
                        szczegolowaTresc: dataParams,
                        isOption: false,
                        status: KWESTIA_STATUS.ADMINISTROWANA,
                        idParametr: ret,
                        typ: KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE
                    }];

                    Meteor.call('addKwestiaADMINISTROWANA', newKwestia, function (error, kwestiaId) {
                        if (error)
                            throwError(error.reason);
                        else {
                            addPowiadomienieGlobalneFunction(kwestiaId);
                            Meteor.call('sendEmailAddedIssue', kwestiaId, Etc.getUserLanguage(), function (error) {
                                if (error) {
                                    var emailError = {
                                        idIssue: kwestiaId,
                                        type: NOTIFICATION_TYPE.NEW_ISSUE
                                    };
                                    Meteor.call('addEmailError', emailError);
                                }
                            });
                        }
                    });
                }
            }
        });
        Session.setPersistent('chosenParameterSession', null);
        $('#editParametrMod').modal('hide');
    }
};

var addPowiadomienieGlobalneFunction = function (idKwestia) {
    var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
    var kwestia = Kwestia.findOne({_id: idKwestia});
    users.forEach(function (user) {
        var newPowiadomienie = {
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: kwestia.dataWprowadzenia,
            tytul: '',
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: '',
            idKwestia: idKwestia,
            czyAktywny: true,
            czyOdczytany: false
        };
        Meteor.call('addPowiadomienie', newPowiadomienie, function (error) {
            if (error)
                throwError(error.reason);
        });
    });

};

var checkIssueGlobalParamExists = function () {
    var kwestie = Kwestia.find({
        typ: KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE, czyAktywny: true,
        status: {$nin: [KWESTIA_STATUS.ZREALIZOWANA, KWESTIA_STATUS.ARCHIWALNA]}
    });
    return kwestie.count() > 0;
};
