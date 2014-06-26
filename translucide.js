/*jslint node: true */
'use strict';
var casper = require('casper').create();
var utils = require('utils');
var system = require('system');

function getTD(casper, i, j) {
    return casper.getElementInfo('.section-content tbody tr:nth-child(' + (i + 1) + ') td:nth-child(' + j + ')').text;
}

if (casper.cli.args[0]) {
    casper.start('https://www.transparence.sante.gouv.fr/flow/rechercheBeneficiaires', function () {
        this.fill('form[id="form"]', { 'form:nom-autocomplete': casper.cli.args[0] }, false);
        this.click('.btn-action');
    });

    casper.waitForSelector('.label-captcha', function () {
        var matches = this.getElementInfo('.label-captcha').text.match(new RegExp('Quelle est la (.*) lettre du mot « (.*) »'));
        this.fill('form[id="j_idt62"]', { 'j_idt62:captcha': matches[2].substr(matches[1].replace(new RegExp('ème|ère'), '') - 1, 1) }, false);
        this.click('input[name="j_idt62:j_idt70"]');
    });

    casper.waitForSelector('#j_idt74', function () {
        var fieldset, results, i;
        if (casper.cli.args[1] === 'student') {
            fieldset = 'fieldset:nth-of-type(2)';
        } else {
            fieldset = 'fieldset:first-of-type';
        }
        if (this.exists('#j_idt74 ' + fieldset + ' .section-recipient tbody tr')) {
            results = this.getElementsInfo('#j_idt74 ' + fieldset + ' .section-recipient tbody tr');
            for (i = 1; i <= results.length; i += 1) {
                this.click(fieldset + ' tr:nth-child(' + i + ') input[type="checkbox"]');
            }
            this.click('input[name="j_idt74:j_idt194"]');
        } else {
            this.echo('No result');
            this.exit();
        }
    });

    casper.waitForSelector('table[id="j_idt17:dataTable"]', function () {
        var results = this.getElementsInfo('.section-content tbody tr'), i;
        for (i = 0; i < results.length; i += 1) {
            this.echo(getTD(this, i, 1) + ' | ' + getTD(this, i, 2) + ' | ' + this.getElementInfo('.section-content tbody tr:nth-child(' + (i + 1) + ') td:nth-child(3) .withJS').text.replace(/(\r\n|\n|\r)/gm, '') + ' | ' + getTD(this, i, 4) + ' | ' + getTD(this, i, 5) + ' | ' + getTD(this, i, 6));
        }
    });
    casper.run();
} else {
    casper.echo('Usage: casperjs ' + system.args[3] + ' DoctorName [student]');
    casper.exit();
}
