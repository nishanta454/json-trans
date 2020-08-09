
const payload_maker = {
    make = function(event, payload, response) {
        
    }
}

module.exports = payload_maker;




function constructPayload(fact, resOBJ) {
    let finalReq = {};
    finalReq.requestContext = {};
    finalReq.requestContext.appName = fact.jsonRequest.requestMetaData.appName || '';

    finalReq.requestContext.lineOfBusiness = fact.jsonRequest.requestMetaData.lineOfBusiness || '';
    finalReq.requestContext.conversationID = fact.jsonRequest.requestMetaData.conversationID || '';
    finalReq.requestPayload = {};
    finalReq.requestPayload.messageData = {};
    finalReq.requestPayload.messageData.campaignId = fact.jsonRequest.requestPayloadData.data.campaignID;

    finalReq.requestPayload.messageData.clientSet = fact.jsonRequest.requestPayloadData.data.clientSet || '';
    finalReq.requestPayload.messageData.clientId = fact.jsonRequest.requestPayloadData.data.clientID || '';
    finalReq.requestPayload.messageData.channel = fact.jsonRequest.requestPayloadData.data.commDeliveryChannel || 'email';
    finalReq.requestPayload.messageData.language = fact.jsonRequest.requestPayloadData.data.languageIndicator || '1'; // To be checked
    finalReq.requestPayload.messageData.cagm = {};

    finalReq.requestPayload.messageData.cagm.carrier = fact.jsonRequest.requestPayloadData.data.carrierID || '';
   
    finalReq.requestPayload.messageData.cagm.account = fact.jsonRequest.requestPayloadData.data.accountID || '';
    
    finalReq.requestPayload.messageData.cagm.group = fact.jsonRequest.requestPayloadData.data.groupID || '';
    
    finalReq.requestPayload.messageData.cagm.member = fact.jsonRequest.requestPayloadData.data.externalID || fact.jsonRequest.requestPayloadData.data.memberID;
    
    finalReq.requestPayload.additionalData = {};
    if (fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "CAMPAIGN_NOTIFICATION_ND_DES") {
        finalReq.requestPayload.additionalData.DESRecipientData = {};
        finalReq.requestPayload.additionalData.DESRecipientData.memberFirstName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.DESRecipientData.planName = fact.jsonRequest.requestPayloadData.data.planName || '';
        finalReq.requestPayload.additionalData.DESRecipientData.currentPlanYear = fact.jsonRequest.requestPayloadData.data.planYear || '';
        finalReq.requestPayload.additionalData.DESRecipientData.memberEmailAddress = fact.jsonRequest.requestPayloadData.data.channelID || '';
        finalReq.requestPayload.additionalData.DESRecipientData.nextPlanYear = fact.jsonRequest.requestPayloadData.data.nextPlanYear || '';
        finalReq.requestPayload.additionalData.DESRecipientData.previousPlanYear = fact.jsonRequest.requestPayloadData.data.previousPlanYear || '';
        finalReq.requestPayload.additionalData.DESRecipientData.clientName = fact.jsonRequest.requestPayloadData.data.clientName || '';
        finalReq.requestPayload.additionalData.DESRecipientData.documentName = fact.jsonRequest.requestPayloadData.data.documentName || '';
        finalReq.requestPayload.additionalData.DESRecipientData.amount = fact.jsonRequest.requestPayloadData.data.amount || '';
        finalReq.requestPayload.additionalData.DESRecipientData.dueDate = fact.jsonRequest.requestPayloadData.data.dueDate || '';
        finalReq.requestPayload.additionalData.DESRecipientData.paymentID = fact.jsonRequest.requestPayloadData.data.paymentID || '';
        finalReq.requestPayload.additionalData.DESRecipientData.unsubxid = resOBJ.result.unsubscribexid || '';
    } else if (fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "ONE_CLICK_EOB"
        || fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "CAMPAIGN_NOTIFICATION_EOB_GUEST") {
        finalReq.requestPayload.additionalData.OneclickRecipientData = {};
        finalReq.requestPayload.additionalData.OneclickRecipientData.displayName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.firstName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.lastName = fact.jsonRequest.requestPayloadData.data.lastName || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.emailAddress = fact.jsonRequest.requestPayloadData.data.commContactInfo || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.planName = fact.jsonRequest.requestPayloadData.data.planName || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.reqxid = resOBJ.result.xid || '';
        finalReq.requestPayload.additionalData.OneclickRecipientData.unsubxid = resOBJ.result.unsubscribexid || '';
    } else if (fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "CAMPAIGN_NOTIFICATION_HEE_EMAIL" ||
        fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "CAMPAIGN_NOTIFICATION_HEE_SMS") {
        let data = fact.jsonRequest.requestPayloadData.data;
        let rxsArr = data.opportunity.rxs;
        let iterativeDataTemp = [];
        finalReq.requestPayload.additionalData.displayName = data.opportunity.member.memberFirstName || '';
        finalReq.requestPayload.additionalData.emailAddress = data.channelID || '';
        finalReq.requestPayload.additionalData.memberID = data.opportunity.member.memberID || '';
        finalReq.requestPayload.additionalData.firstName = data.opportunity.member.memberFirstName || '';
        finalReq.requestPayload.additionalData.lastName = data.opportunity.member.memberLastName || '';
        finalReq.requestPayload.additionalData.memberFirstName = data.opportunity.member.memberFirstName || '';
        finalReq.requestPayload.additionalData.planName = "";
        finalReq.requestPayload.additionalData.reqxid = resOBJ.result.xid || '';
        finalReq.requestPayload.additionalData.unsubxid = resOBJ.result.unsubscribexid || '';

        finalReq.requestPayload.messageData.cagm.carrier = data.opportunity.client.carrier || '';
        finalReq.requestPayload.messageData.cagm.account = data.opportunity.client.account || '';
        finalReq.requestPayload.messageData.cagm.group = data.opportunity.client.groupNbr || '';
        finalReq.requestPayload.messageData.cagm.member = data.externalID || data.opportunity.member.memberID;
        finalReq.requestPayload.additionalData.opportunityFlex12 = data.opportunity.opportunityPassThruFiller12 || '';
        rxsArr.forEach((rxsObj) => {
            let rxsObject = {};
            rxsObject.drugName = rxsObj.targetDrug.drugLabelName || '';
            rxsObject.drugShortName = getFirstChar(rxsObj.targetDrug.drugShortName) || '';
            rxsObject.fillDate = dataFormate(rxsObj.fillDate) || '';
            rxsObject.fillLocation = rxsObj.fillLocationCd || '';
            rxsObject.fillNbr = rxsObj.fillNbr || '';
            rxsObject.nextFillDate = dataFormate(rxsObj.nextFillDate) || '';
            rxsObject.pharmacyName = rxsObj.pharmacy.pharmacyName || '';
            //Start Added as part of HEE Pharmacy Campaign July 15 2020
            rxsObject.pharmacyAddrLine1 = rxsObj.pharmacy.pharmacyAddrLine1 || '';
            rxsObject.pharmacyCity = rxsObj.pharmacy.pharmacyCity || '';
            rxsObject.pharmacyStateCd = rxsObj.pharmacy.pharmacyStateCd || '';
            rxsObject.pharmacyZipCd = rxsObj.pharmacy.pharmacyZipCd || '';
            rxsObject.pharmacyPhone = rxsObj.pharmacy.pharmacyPhone || '';
            //End Added as part of HEE Pharmacy Campaign July 15 2020
            rxsObject.prescriberFirstName = rxsObj.prescriber.prescriberFirstName || '';
            rxsObject.prescriberLastName = rxsObj.prescriber.prescriberLastName || '';
            rxsObject.rxNumber = formateRxNumber(rxsObj.rxNbr) || '';
            rxsObject.rxWrtnDate = dataFormate(rxsObj.rxWrtnDate) || '';
            rxsObject.daySupply = rxsObj.daySupply || '';
            iterativeDataTemp.push(rxsObject);
        });

        finalReq.requestPayload.additionalData.iterativeData = iterativeDataTemp;
        finalReq.requestPayload.messageData.opportunity = {};
        finalReq.requestPayload.messageData.channel = data.channelType || 'Email';
        finalReq.requestPayload.messageData.opportunity.subtypeCode = data.opportunity.opportunitySubTypeCd || '';
        finalReq.requestPayload.messageData.opportunity.templateId = data.opportunity.messageTemplateId || '';
    } else if (fact.jsonRequest.requestPayloadData.data.eventName.toUpperCase() === "CAMPAIGN_NOTIFICATION_EOB_ANTHEM") {
        finalReq.requestPayload.messageData.lobCode = fact.jsonRequest.requestPayloadData.data.lob || '3';
        finalReq.requestPayload.messageData.stateCode = fact.jsonRequest.requestPayloadData.data.stateCode || '0';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData = {};
        var cbsData = fact.jsonRequest.requestPayloadData.data.CBSData || {}
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.displayName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.firstName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.lastName = fact.jsonRequest.requestPayloadData.data.lastName || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.emailAddress = fact.jsonRequest.requestPayloadData.data.commContactInfo || '';
        if (fact.jsonRequest.requestPayloadData.data.lob === '4') {
            finalReq.requestPayload.additionalData.AnthemEOBRecipientData.planName = cbsData.planName || fact.jsonRequest.requestPayloadData.data.planName;
        } else {
            finalReq.requestPayload.additionalData.AnthemEOBRecipientData.planName = fact.jsonRequest.requestPayloadData.data.planName || '';
        }
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.planNameType = cbsData.planName || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.logoName = cbsData.logoName || 'IngenioRx';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.myAccountURL = cbsData.myAccountURL || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.federalStatement = cbsData.federalStatement || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.mailLegalTagLine = cbsData.mailLegalTagLine || '';
        if (cbsData.mailLegalTagLine) {
            var baseContent = Buffer.from(cbsData.mailLegalTagLine, 'base64');
            let tagLine = baseContent.toString('utf-8');
            finalReq.requestPayload.additionalData.AnthemEOBRecipientData.mailLegalTagLinePara = 'true'
            finalReq.requestPayload.additionalData.AnthemEOBRecipientData.mailLegalTagLine = tagLine || '';
        }
        if (cbsData.federalStatement) {
            var baseContent = Buffer.from(cbsData.federalStatement, 'base64');
            let fedStat = baseContent.toString('utf-8');
            finalReq.requestPayload.additionalData.AnthemEOBRecipientData.federalStatement = fedStat || '';
        }
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.senderName = cbsData.senderName || '';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.privacyURL = cbsData.privacyURL || 'view our policy';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.profileCommunicationsPreferences = cbsData.profileCommunicationsPreferences || 'Manage Subscriptions';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.homePageURL = cbsData.homePageURL || 'Update Profile';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.hippaURL = cbsData.hippaURL || 'HIPPA';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.termsAndConditionURL = cbsData.termsAndConditionURL || 'Terms and Conditions';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.providerLogoURL = cbsData.providerLogoURL || 'IngenioRx';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.providerLogoName = cbsData.providerLogoName || 'IngenioRx';
        finalReq.requestPayload.additionalData.AnthemEOBRecipientData.providerCompanyName = cbsData.providerCompanyName || 'IngenioRx';
    } else {
        finalReq.requestPayload.additionalData.EOBRecipientData = {};
        finalReq.requestPayload.additionalData.EOBRecipientData.displayName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.EOBRecipientData.firstName = fact.jsonRequest.requestPayloadData.data.firstName || '';
        finalReq.requestPayload.additionalData.EOBRecipientData.lastName = fact.jsonRequest.requestPayloadData.data.lastName || '';
        finalReq.requestPayload.additionalData.EOBRecipientData.emailAddress = fact.jsonRequest.requestPayloadData.data.commContactInfo || '';
        finalReq.requestPayload.additionalData.EOBRecipientData.planName = fact.jsonRequest.requestPayloadData.data.planName || '';
    }

    return finalReq;
}