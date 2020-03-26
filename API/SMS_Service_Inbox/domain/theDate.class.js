class changeDate {
    d; month; day; year; hh; mm; ss;

    constructor(date) {
        this.d = date;
        this.month = '' + (this.d.getMonth() + 1);
        this.day = '' + this.d.getDate();
        this.year = this.d.getFullYear();
        this.hh = '' + this.d.getHours();
        this.mm = '' + this.d.getMinutes();
        this.ss = '' + this.d.getSeconds();

        if (this.month.length < 2) this.month = '0' + this.month;
        if (this.day.length < 2) this.day = '0' + this.day;
        if (this.hh.length < 2) this.hh = '0' + this.hh;
        if (this.mm.length < 2) this.mm = '0' + this.mm;
    }

    get theMonth() {
        return this.month;
    }

    get theDay() {
        return this.day;
    }

    get theYear() {
        return this.year;
    }

    get thehh() {
        return this.hh;
    }

    get thess() {
        return this.ss;
    }

    get themm() {
        return this.mm;
    }
}

module.exports = changeDate;
