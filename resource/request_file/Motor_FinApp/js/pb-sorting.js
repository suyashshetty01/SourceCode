jQuery.fn.extend({
    pbsort: function (is_ascending, parameter) {
        var element = $(this);      
        var arDivs = [];
        element.each(function (index) {
            arDivs[index] = $(this);
        });
        for (var i = 0; i < arDivs.length - 1; i++) {
            var min = i;
            for (var j = i + 1; j < arDivs.length; j++) {
                if ((is_ascending && parseFloat(arDivs[j].attr(parameter)) < parseFloat(arDivs[min].attr(parameter))) ||
                    (!is_ascending && parseFloat(arDivs[j].attr(parameter)) > parseFloat(arDivs[min].attr(parameter)))) {
                    min = j;
                }
            }
            var temp = arDivs[i];
            arDivs[i] = arDivs[min];
            arDivs[min] = temp;
        }
        return arDivs;
    }
});