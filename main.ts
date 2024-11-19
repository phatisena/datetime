//%block="DateTime" color="#17e689" icon="\uf073"
namespace datetime {

    export enum datetype {
        daymonth,
        month,
        year,
        weekday,
        weekmonth,
        dayyear,
        daysince
    }

    export function gettype(dt: datetype) {
        switch (dt) {
            case datetype.daymonth:
            return 0;
            case datetype.month:
            return 1;
            case datetype.year:
            return 2;
            case datetype.weekday:
            return 3;
            case datetype.weekmonth:
            return 4;
            case datetype.dayyear:
            return 5;
            case datetype.daysince:
            return 6;
            default:
            return -1;
        }
    }
    
    export function setup(min: number, max: number) {
        let datetable: number[][] = [[],[],[],[],[],[],[]]
        let dayformat: number[][] = [[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]]
        let remdate: number[] = [4,7,52]
        let ds = 1
        let ey = 0
        let dy = 1
        let dm = 1
        let dw = 1
        let sw = 5
        let mo = 1
        let ye = 1
        let wn = 1
        let dss = 0
        for (let _y = 0; _y < max; _y++) {
            ey = 0
            dy = 1
            if (ye % remdate[0] == 0) {
                ey = 1
            }
            mo = 1
            for (let _m = 0; _m < dayformat[ey].length; _m++) {
                dm = 1
                for (let _d = 0; _d < dayformat[ey][_m]; _d++) {
                    dw = ((ds + sw) % remdate[1]) + 1
                    wn = (((Math.floor((ds + sw) / remdate[1]) - 1) % remdate[2]) + 1)
                    if (_y > min) {
                        datetable[0].push(dm)
                        datetable[1].push(mo)
                        datetable[2].push(ye)
                        datetable[3].push(dw)
                        datetable[4].push(wn)
                        datetable[5].push(dy)
                        datetable[6].push(ds - dss)
                    }
                    dm += 1
                    ds += 1
                    dy += 1
                }
                mo += 1
                ds += 1
                dy += 1
            }
            if (_y == min) {
                dss = ds
            }
            ds += 1
            ye += 1
        }
        return datetable
    }

    export let datetimet: number[][] = setup(1,5000)

    //%blockid=date_setup
    //%block="setup datetime between $min and $max"
    //%group="create"
    export function setdate(min: number, max: number) {
        datetimet = setup(min,max)
    }

    //%blockid=date_getinidx
    //%block="get date number array in $idx"
    //%group="get date"
    export function getdateindex(idx: number) {
        if (idx < 0) { return [0,0,0,0,0,0,0] }
        return [datetimet[0][idx],datetimet[1][idx],datetimet[2][idx],datetimet[3][idx],datetimet[4][idx],datetimet[5][idx],datetimet[6][idx]]
    }

    //%blockid=date_getinzone
    //%block="on get date index $idx in daymonth $daymonth month $month year $year weekday $weekday weekmonth $weekmonth dayyear $dayyear daysince $daysince"
    //%daymonth.shadow=variables_get daymonth.defl=daymonth
    //%draggableParameters="reporter"
    //%handlerStatement=1
    //%group="get date"
    export function getdateinzone(idx: number, getdate:(daymonth: number, month: number, year: number, weekday: number, weekmonth: number, dayyear: number, daysince: number) => void) {
        let daymonth = datetimet[0][idx]
        let month = datetimet[1][idx]
        let year = datetimet[2][idx]
        let weekday = datetimet[3][idx]
        let weekmonth = datetimet[4][idx]
        let dayyear = datetimet[5][idx]
        let daysince = datetimet[6][idx]
        getdate(daymonth,month,year,weekday,weekmonth,dayyear,daysince)
    }
    
    //%blockid=date_getdatefrommian
    //%block="get date at day $day month $month year $year"
    //%group="get date"
    export function getdate(day: number, month: number, year: number) {
        let _i = 0
        while (datetimet[2][_i] < year) {
            _i += 1
        }
        while (datetimet[1][_i] < month) {
            _i += 1
        }
        while (datetimet[1][_i] < day) {
            _i += 1
        }
        return getdateindex(_i)
    }

    //%blockid=date_getinone
    //%block="get date index $idx in $dt"
    //%group="get date"
    export function getoneval(idx:number,dt:datetype) {
        let _j = gettype(dt)
        return getdateindex(idx)[_j]
    }
}
