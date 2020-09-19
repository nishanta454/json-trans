const jp = require('jsonpath');

var elms;
var virgin;

let parser = {
    parse: function (fromPayload, toPayload, dataDictonary, functions) {
        dataDictonary.forEach(mapping => {
            var func = undefined;
            if (mapping.function) {
                func = functions[mapping.function]
            }
            elms = []
            virgin = true
            this.updateObject(mapping.source, mapping.target, fromPayload, toPayload, func)
        });
        console.log(JSON.stringify(toPayload))
    },
    updateObject: function (sourcePath, targetField, fromPayload, toPayload, func) {
        var path = jp.paths(fromPayload, '$.' + sourcePath)
        if (path && path.length > 0) {
            var stop = false;
            var prog = [];
            var arrays = {};
            path[0].forEach((node, index) => {
                if (node != '$' && !stop) {
                    prog.push(node)
                    var value = jp.query(fromPayload, util.createJpExp(prog, arrays));
                    if (util.findType(value[0]) == 'String' || index == path[0].length - 1) {
                        this.setValue(toPayload, targetField, value[0], func)
                    } else if (util.findType(value[0]) == 'Array') {
                        virgin = false
                        stop = true;
                        arrays[node] = true;
                        if (util.findType(value[0][0]) == 'String') {
                            this.setValue(toPayload, targetField, value[0], func)
                        } else {
                            if (!toPayload[node] || util.findType(toPayload[node]) != 'Array') {
                                elms.forEach(elm => {
                                    if(!toPayload[elm])
                                        toPayload[elm] = {}
                                    toPayload = toPayload[elm]
                                }); 
                                toPayload[node] = []
                            }
                            toPayload = toPayload[node]
                            value[0].forEach((val, indx) => {
                                var elem = null;
                                if (toPayload.length > indx) {
                                    elem = toPayload[indx]
                                } else {
                                    elem = {}
                                    toPayload.push(elem)
                                }
                                this.updateObject(util.shrinkJpExp(sourcePath, prog), targetField, val, elem)
                            })
                        }
                    } else if (util.findType(value[0]) == 'Object') {
                        if (!virgin)
                            elms.push(node)
                    }
                }
            })
        }
    },
    setValue: function (obj, path, value, func) {
        var parts = path.split(".")
        for (var i = 0; i < parts.length; i++) {
            if (i < parts.length - 1) {
                if (!obj[parts[i]]) {
                    obj[parts[i]] = {}
                }
                obj = obj[parts[i]]
            } else {
                obj[parts[i]] = func ? func(value) : value
            }
        }
    }
}

let util = {
    findType: function (s) {
        if (s.constructor === String) {
            return "String";
        }
        if (s.constructor === Array) {
            return "Array";
        } else if (s.constructor === Object) {
            return "Object";
        } else if (s.constructor === Number) {
            return "Number";
        } else if (s.constructor === Boolean) {
            return "Boolean";
        }
    },
    shrinkJpExp: function (s, p) {
        let exp = s.replace(p.join('.'), '').replace('[*]', '')
        let nxp = []
        exp.split('.').forEach(function (el) {
            if (el) {
                nxp.push(el);
            }
        });
        return nxp.join('.');
    },
    createJpExp: function (p, ar) {
        var exp = ['$']
        p.forEach(el => {
            if (ar[el]) {
                exp.push(el + '[*]')
            } else {
                exp.push(el)
            }
        })
        return exp.join('.')
    }
}

var functions = {
    toUpperCaseX: function (val) {
        return val ? val.toUpperCase() : val;
    },
    dataFormate: function (date) {
        if (date !== null && date !== undefined) {
            return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
        }
        return null;
    },
    getFirstChar: function (data) {
        if (data !== null && data !== undefined) {
            return data.charAt(0).toUpperCase();
        }
        return null;
    },
    formateRxNumber: function (num) {
        if (num !== null && num !== undefined) {
            return num.replace(/\d(?=\d{4})/g, "*");
        }
        return null;
    }
}

var emappings = [{ "source": "requestPayloadData.data.opportunity.member.memberFirstName", "target": "displayName", "function": null }, { "source": "requestPayloadData.data.channelID", "target": "emailAddress", "function": null }, { "source": "requestPayloadData.data.opportunity.member.memberID", "target": "memberID", "function": null }, { "source": "requestPayloadData.data.opportunity.member.memberFirstName", "target": "firstName", "function": null }, { "source": "requestPayloadData.data.opportunity.member.memberLastName", "target": "lastName", "function": null }, { "source": "result.xid", "target": "reqxid", "function": null }, { "source": "result.unsubscribexid", "target": "unsubxid", "function": null }, { "source": "requestPayloadData.data.opportunity.client.carrier", "target": "carrier", "function": null }, { "source": "requestPayloadData.data.opportunity.client.account", "target": "account", "function": null }, { "source": "requestPayloadData.data.opportunity.client.groupNbr", "target": "group", "function": null }, { "source": "requestPayloadData.data.externalID", "target": "member", "function": null }, { "source": "requestPayloadData.data.opportunity.opportunityPassThruFiller12", "target": "opportunityFlex12", "function": null }, { "source": "requestPayloadData.data.channelType", "target": "channel", "function": null }, { "source": "requestPayloadData.data.opportunity.opportunitySubTypeCd", "target": "subtypeCode", "function": null }, { "source": "requestPayloadData.data.opportunity.messageTemplateId", "target": "templateId", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].targetDrug.drugLabelName", "target": "targetDrug.drugName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].targetDrug.drugShortName", "target": "targetDrug.drugShortName", "function": "firstChar" }, { "source": "requestPayloadData.data.opportunity.rxs[*].fillDate", "target": "fillDate", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].fillLocationCd", "target": "fillLocation", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].fillNbr", "target": "fillNbr", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].nextFillDate", "target": "nextFillDate", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyName", "target": "pharmacy.pharmacyName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyAddrLine1", "target": "pharmacy.pharmacyAddrLine1", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyCity", "target": "pharmacy.pharmacyCity", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyStateCd", "target": "pharmacy.pharmacyStateCd", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyZipCd", "target": "pharmacy.pharmacyZipCd", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].pharmacy.pharmacyPhone", "target": "pharmacy.pharmacyPhone", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].prescriber.prescriberFirstName", "target": "prescriber.prescriberFirstName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].prescriber.prescriberLastName", "target": "prescriber.prescriberLastName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].rxNbr", "target": "rxNumber", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].rxWrtnDate", "target": "rxWrtnDate", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].daySupply", "target": "daySupply", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].targetDrug.alternateDrugs[*].drugLabelName", "target": "drugLabelName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].targetDrug.alternateDrugs[*].drugShortName", "target": "drugShortName", "function": null }, { "source": "requestPayloadData.data.opportunity.rxs[*].targetDrug.alternateDrugs[*].drugSavingOptions[*].pharmacyType", "target": "pharmacyType", "function": null }]
var erpayload = { "requestMetaData": { "appName": "DEP", "lineOfBusiness": "HEE", "conversationID": "12312300917" }, "requestPayloadData": { "data": { "requestID": "12312300917", "campaignID": "2591", "campaignName": "Pharmacy Adv Pre Refill", "externalID": "40235610001", "interactionID": "6805", "eventName": "CAMPAIGN_NOTIFICATION_HEE_EMAIL", "clientID": "24370", "lob": "HEE", "alertID": "2591", "channelID": "ganesh.bandu@cvshealth.com", "channelType": "Email", "programName": "ENT_HEE_DEP_EMAIL", "secureChannelIND": "", "clientSecureChannelIND": "", "languageIndicator": "1", "appName": "DEP", "memberSource": "QL", "alertSourceSystem": "DEP", "vaultEnabled": "N", "logCHV": "Y", "fileID": "HEE_To_DEP_20200713150355_346892.txt", "opportunity": { "opportunitySrcCd": "PW", "opportunityId": "205138013", "externalOpportunityId": "110064093931", "opportunityProgramCd": "PGMPAPDIAB", "opportunityProgramName": "PAP", "opportunityTypeCd": "OTREMNDRPA", "opportunityTypeName": "Refill Reminder: PA", "opportunitySubTypeCd": "OSCV25M", "opportunitySubTypeName": "CV _ Mail/Other _ Proactive Refill Reminder", "opportunityCampaignId": "OSCV25M", "alertId": "6612", "commProgramId": "6612", "opportunityEffDt": "20200617000000", "opportunityExprnDt": "20200719000000", "opportunityActionCd": "A", "opportunityStsRsnCd": "1", "messageEventId": "205138048", "channelCode": "CHSMSDEP", "channelAltId": "57", "messageTemplateId": "51867C2", "messageTx": "51867C2", "opportunitySegmentName": "ALLSEGMENTS", "deliveryTgtPrsnCd": "PTNT", "opportunityPassThruFiller5": "FL2587054", "opportunityPassThruFiller8": "CHOL", "opportunityPassThruFiller12": "ROS", "opportunityPassThruFiller16": "0", "opportunityPassThruFiller18": "SmsDEP", "opportunityPassThruFiller20": "5956902", "member": { "psrnSrcCd": "D", "ephLinkId": "12064790027", "qlBeneficiaryId": "944530344", "cdhQLBeneficiaryId": "944530344", "mbrRelationshipCd": "CRDHLD", "pbmUniqueMbrid": "1054%45071833%002%40235610001%", "memberId": "40235610001", "memberFirstName": "TXLB", "memberLastName": "EXHDJ", "memberMiddleName": "H", "birthDt": "94970913000000", "minorInd": "Y", "genderCd": "M", "memberLangCd": "EN", "pharmacyAdvisorInd": "N", "readyFillAtMailEligInd": "N" }, "client": { "carrier": "1054", "account": "05AP", "groupNbr": "002", "qlclientId": "24370", "qlClientCd": "X1054", "rxClaimClientCd": "KEHP", "clientname": "COMMONWEALTH OF KENTUCKY", "medicaidInd": "N" }, "rxs": [{ "rxFillEventId": "205138106", "rxNbr": "7944919", "rxActionCd": "A", "fillNbr": "0", "refillRemainingNbr": "0", "fillDate": "20200317000000", "rxWrtnDate": "20200317000000", "daySupply": "90", "nextFillDate": "20200615000000", "dispenseQty": "90", "fillLocationCd": "nCVS", "readyFillEnrollmentInd": "0", "clmAdjSrcCd": "D", "clmNbr": "200774921378131", "clmSeqNbr": "999", "rxCOBInd": "PR", "rxDAWCd": "0", "binNbr": "004336", "pcnNbr": "ADV", "groupNbr": "RX1054", "thirdPartyPlanNbr": "00", "opportunityRxPassThruFiller8": "00", "opportunityRxPassThruFiller12": "ROS", "pharmacy": { "pharmacyNcpdpId": "1816391", "pharmacyNpiId": "1811914237", "pharmacyChainNbr": "229", "pharmacyName": "WALMART PHARMACY", "pharmacyType": "Retail", "pharmacyPhone": "2706850027", "pharmacyAddrLine1": "5031 FREDERICA STREET", "pharmacyCity": "OWENSBORO", "pharmacyStateCd": "KY", "pharmacyZipCd": "42301" }, "prescriber": { "prescriberFirstName": "WLHXUX", "prescriberLastName": "EUVGDVY", "prescriberMiddleName": "MPRBZ", "prescriberFaxNbr": "7231879533", "prescriberPhoneNbr": "7231879640", "prescriberAddrLine1": "2851 NEW HARTFORD RD", "prescriberAddrLine2": "STE A", "prescriberCity": "OWENSBORO", "prescriberStateCd": "KY", "prescriberZipCd": "42303" }, "targetDrug": { "ndc": "72205000490", "drugLabelName": "ROSUVASTATIN TAB 20MG", "drugShortName": "ROSUVASTATIN", "drugClass": "HMG COA REDUCTASE INHIBITORS", "drugDosageForm": "TAB", "drugStrength": "20MG", "pkgSizeQty": "90", "drugUOM": "EACH", "brandGenericCd": "G", "specialtyDrugInd": "N", "maintenanceInd": "Y", "gpi": "39400060100320", "gcnSeqNbr": "51785", "legalSts": "RX", "drugPDCScore": "0", "alternateDrugs": [{ "drugLabelName": "Tynenol 40x", "drugShortName": "T", "drugSavingOptions": [{ "pharamacyType": "Online" }] }] } }] }, "activityTemplateID": "DigitalHEETestWorkFlow" } }, "result": { "xid": "8gllwxM", "unsubscribexid": "vLll1LG" } }
var erepayload = {}

parser.parse(erpayload, erepayload, emappings, functions);
