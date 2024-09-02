﻿function eventsubmmision(Flag, action, label, eventname,Type) {

    var category = "";
    var pagepath = "";
    switch (Flag) {
        case 1:
            category = 'car-insurance';
            pagepath = "vpv/" + Type + "/" + label;
            break;
        case 2:
            category = 'health-insurance';
            pagepath = "vpv/" + Type + "/" + label;
            break;
        case 3:
            category = 'travel-insurance';
            pagepath = "vpv/" + $("#InsuredGender").val() + "/" + label;
            break;
        case 4:
            category = 'term-insurance';
            pagepath = "vpv/" + $("#InsuredGender").val() + "-" + $("#SumAssuredText").val() + "/" + label;
            break;
        case 5:
            category = 'twowheeler-insurance';
            break;
        case 6:
            category = 'policyboss Logo';
            break;
        case 7:
            category = 'topnav';
            break;
        case 8:
            category = 'Footer';
            break;
        case 9:
            category = 'Link to home';
            break;
        case 10:
            category = 'leftnav';
            break;
        case 11:
            category = 'Send Email';
            break;
        case 12:
            category = 'Contact us';
            break;
        case 13:
            category = 'apply form';
            break;
        case 14:
            category = 'Claim Process';
            break;
        case 15:
            category = 'Login';
            break;
        case 16:
            category = 'download';
            break;
        case 17:
            category = 'knowledge center';
            break;
        case 18:
            category = 'insurance blog';
            break;
        case 19:
            category = 'rightnav';
            break;
        case 20:
            category = 'videos';
            break;
        case 21:
            category = 'insurance partners';
            break;
        case 22:
            category = 'feedback';
            break;
        case 23:
            category = 'About-Us';
            break;
        case 24:
            category = 'CancellationRefund';
            break;
        case 25:
            category = 'Terms';
            break;
        case 26:
            category = 'Code of Conduct';
            break;
        case 27:
            category = 'Privacy Policy';
            break;
        case 28:
            category = 'Sitemap';
            break;
        default:
            break;
    }
    dataLayer.push({
        'category': category,
        'action': action,
        'label': label,
        'event': eventname,
        'Pagepath':pagepath
    });
}