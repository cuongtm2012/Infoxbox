module.exports = function bodySubmitInformationEContract(request) {
    this.templateId = request.templateId;
    this.alias = request.alias;
    this.syncType = request.syncType;
    this.datas = [request.datas];
}