function mobileValid(_Mobile) {
    var regMobile = new RegExp("^[6-9]{1}[0-9]{9}$");
    return regMobile.test(_Mobile);
}
function emailValid(_email) {
    var regEmail = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
    return regEmail.test(_email);
}
function nameValid(_str) {
    var reg = /^[a-zA-Z ]+$/;
    return reg.test(_str);
}
function passportValid(_number) {
    var reg = new RegExp("^[A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$");
    return reg.test(_number);
}

function isDate(value) {
    try {
        //Change the below values to determine which format of date you wish to check. It is set to dd/mm/yyyy by default.
        var DayIndex = 0;
        var MonthIndex = 1;
        var YearIndex = 2;

        value = value.replace(/-/g, "/").replace(/\./g, "/");
        var SplitValue = value.split("/");
        var OK = true;
        if (!(SplitValue[DayIndex].length == 1 || SplitValue[DayIndex].length == 2)) {
            OK = false;
        }
        if (OK && !(SplitValue[MonthIndex].length == 1 || SplitValue[MonthIndex].length == 2)) {
            OK = false;
        }
        if (OK && SplitValue[YearIndex].length != 4) {
            OK = false;
        }
        
        if (OK) {
            var Day = parseInt(SplitValue[DayIndex], 10);
            var Month = parseInt(SplitValue[MonthIndex], 10);
            var Year = parseInt(SplitValue[YearIndex], 10);

            if (OK = (Year > 1900)) {
                if (OK = (Month <= 12 && Month > 0)) {
                    var LeapYear = (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0));
                    if (Month == 2) {
                        OK = LeapYear ? Day <= 29 : Day <= 28;
                    }
                    else {
                        if ((Month == 4) || (Month == 6) || (Month == 9) || (Month == 11)) {
                            OK = (Day > 0 && Day <= 30);
                        }
                        else {
                            OK = (Day > 0 && Day <= 31);
                        }
                    }
                }
            }
        }
        return OK;
    }
    catch (e) {
        return false;
    }
}

function isNumeric(value)
{
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;

    
    if ((intRegex.test(value) || floatRegex.test(value))) {
        return true;
    }
    else {
        return false;
    }
}