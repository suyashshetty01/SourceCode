$(document).ready(function () {
    $("#OpenHospitalNetworkList").click(function () {
        OpenHospitalList();
    });

    function OpenHospitalList() {
        $.ajax({
            url: "/HealthInsuranceIndia/HospitalNetworkListView",
            type: 'GET',
            dataType: 'html',
            data: "insurer=" + $("#OpenHospitalNetworkList").attr("insurer") + "&city=" + $("#OpenHospitalNetworkList").attr("city"),
            success: function (data, textStatus, xhr) {
                $('body').append('<div title="Hospital Network List" id="dialogHospitalNetworkList" style="margin:0px;padding:0px;">' + data + '</div>');
                $("#dialogHospitalNetworkList").html(data);
                $("#dialogHospitalNetworkList").dialog({
                    draggable: false,
                    dataType: "html",
                    autoOpen: true,
                    resizable: false,
                    modal: true,
                    position: {
                        my: 'top',
                        at: 'top'
                    },
                    buttons: {
                        "Close": function () {
                            $("#dialogHospitalNetworkList").dialog("close");
                        }
                    },
                    close: function () {
                        $('#dialogHospitalNetworkList').remove();
                    }
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
    }
});