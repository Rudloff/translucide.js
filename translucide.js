/*jslint node: true */
'use strict';
var casper = require('casper').create();
var utils = require('utils');
var system = require('system');
var page = 1;

function getTD(casper, i, j) {
    return casper.getElementInfo('.section-content tbody tr:nth-child(' + (i + 1) + ') td:nth-child(' + j + ')').text;
}

function nextPage() {
    var results = this.getElementsInfo('.section-content tbody tr'), i;
    for (i = 0; i < results.length; i += 1) {
        this.echo(getTD(this, i, 1) + ' | ' + getTD(this, i, 2) + ' | ' + this.getElementInfo('.section-content tbody tr:nth-child(' + (i + 1) + ') td:nth-child(3) .withJS').text.replace(/(\r\n|\n|\r)/gm, '') + ' | ' + getTD(this, i, 4) + ' | ' + getTD(this, i, 5) + ' | ' + getTD(this, i, 6));
    }
    if (this.exists('.btn-next:enabled')) {
        this.click('.btn-next');
        page += 1;
        this.waitForSelector('.btn-page input[value="' + page + '"]:disabled', nextPage);
    }
}

function clickCheckBoxes() {
    var fieldset, results, i;
    this.echo('Fetching doctors/students: page ' + page);
    if (casper.cli.args[1] === 'student') {
        fieldset = 'fieldset:nth-of-type(2)';
    } else {
        fieldset = 'fieldset:first-of-type';
    }
    if (this.exists('#j_idt75 ' + fieldset + ' .section-recipient tbody tr')) {
        results = this.getElementsInfo('#j_idt75 ' + fieldset + ' .section-recipient tbody tr');
        for (i = 1; i <= results.length; i += 1) {
            this.click(fieldset + ' tr:nth-child(' + i + ') input[type="checkbox"]');
        }
        if (this.exists(fieldset + ' .btn-next:enabled')) {
            this.click(fieldset + ' .btn-next');
            page += 1;
            this.waitForSelector(fieldset + ' .btn-page input[value="' + page + '"]:disabled', clickCheckBoxes);
        } else {
            this.click('input[name="j_idt75:j_idt207"]');
            page = 1;
            this.echo('Fetching results…');
        }
    } else {
        this.echo('No result');
        this.exit();
    }
}

if (casper.cli.args[0]) {
    casper.start('https://www.transparence.sante.gouv.fr/flow/rechercheBeneficiaires', function () {
        this.fill('form[id="form"]', { 'form:nom-autocomplete': casper.cli.args[0] }, false);
        this.click('.btn-action');
    });

    casper.waitForSelector('.label-captcha', function () {
        var matches = this.getElementInfo('.label-captcha').text.match(new RegExp('Quelle est la (.*) lettre du mot « (.*) »'));
        this.fill('form[id="j_idt63"]', { 'j_idt63:captcha': matches[2].substr(matches[1].replace(new RegExp('ème|ère'), '') - 1, 1) }, false);
        this.click('input[name="j_idt63:j_idt71"]');
    });

    casper.waitForSelector('#j_idt75', clickCheckBoxes);

    casper.waitForSelector('table[id="j_idt17:dataTable"]', nextPage);
    casper.run();
} else {
    casper.echo('Usage: casperjs ' + system.args[3] + ' DoctorName [student]');
    casper.exit();
}
