class Campaign {
    constructor (access_token, session_id, CampaignName, BrandName, Message, ScheduleTime, Quota) {
        this.access_token = access_token;
        this.session_id = session_id;
        this.CampaignName = CampaignName;
        this.BrandName = BrandName;
        this.Message = Message;
        this.ScheduleTime = ScheduleTime;
        this.Quota = Quota;
    } 
}

module.exports = Campaign;