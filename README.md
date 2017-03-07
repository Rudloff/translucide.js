# translucide.js

**translucide.js** allows you to search information about doctors on [transparence.sante.gouv.fr](https://www.transparence.sante.gouv.fr/).
It mainly saves you the hassle of filling a captcha everytime you want to search something.

## Dependencies

You need to install CasperJS first: ```sudo npm install -g casperjs```

## Usage

```casperjs translucide.js DoctorName [student]```

_DoctorName_ is the surname of the doctor you want information about.
For example : ```casperjs translucide.js Dupond```

It will return all the results matching this name.

If you want to search information about a student, not a doctor, just add _student_ after the name : ```casperjs translucide.js Martin student```
