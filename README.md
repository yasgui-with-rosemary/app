

# Rosemary
---
[![DOI](https://zenodo.org/badge/914423135.svg)](https://doi.org/10.5281/zenodo.14624851) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![RSD](https://img.shields.io/badge/rsd-grlc_sustainability-blue.svg)](https://research-software-directory.org/projects/enhancing-the-sustainability-of-grlc) [![cffconvert](https://github.com/yasgui-with-rosemary/app/actions/workflows/cffconvert.yml/badge.svg)](https://github.com/yasgui-with-rosemary/app/actions/workflows/cffconvert.yml)

<div align="center">
<img src="img/rosemary-logo-v1.png" alt="rosemary logo" height="250">
</div>

> What if developers and researchers could interact with [Linked Data](https://www.w3.org/DesignIssues/LinkedData) in their applications and analyses as they would any [RESTful API](https://www.geeksforgeeks.org/rest-api-introduction/), no Linked Data or [SPARQL](https://sparql.dev/) knowledge required?

[Rosemary](http://github.com/yasgui-with-rosemary/app) is a plugin for [Yasgui](https://yasgui.triply.cc/) facilitating creation of SPARQL queries without requiring knowledge of SPARQL.

**Recipe:** use [rosemary](http://github.com/yasgui-with-rosemary/app) to construct queries for retrieving relevant data from public Linked Data stores, publish the queries on [Github](http://github.com) using [grlc publisher](https://github.com/CLARIAH/yasgui-grlc-publisher) and convert them to [RESTful APIs](https://www.geeksforgeeks.org/rest-api-introduction/) with [grlc](http://grlc.io).

#### Useful links
---
[What is Linked Data](https://rubenverborgh.github.io/WebFundamentals/semantic-web/)?

[What is SPARQL](https://www.w3.org/TR/sparql11-query/)?

[Yasgui](https://yasgui.triply.cc/) SPARQL editor ([Triply](https://triply.cc/en-US)):
1. [Use it online](https://yasgui.triply.cc/)
2. [Documentation](https://triply.cc/docs/yasgui/)

[Rosemary](http://github.com/yasgui-with-rosemary/app):
1. [Use it online](http://yasgui-with-rosemary.github.io/app)
2. [Documentation](http://yasgui-with-rosemary.github.io/docs)

#### Deploy locally (requires [Docker](https://www.docker.com/))
---
    docker compose up

#### Scope
Rosemary is a proof of concept. It currently does not support the full expressivity of SPARQL (only a restricted subset of [SELECT](https://www.w3.org/TR/sparql11-query/#select) queries are currently supported for example) and that is not the intention. It is a tool which can be useful for:

1. discovering and exploring what data is in a **public** Linked Data store,
2. constructing custom Linked Data queries (without knowledge of Linked Data) retrieving data for:
   1. software applications
   2. data analyses
   3. research projects
   
#### License
Copyright (2025) [Kody Moodley, The Netherlands eScience Center](https://www.esciencecenter.nl/team/dr-kody-moodley/)

This project is licensed under the [MIT License](LICENSE).

#### Credits
---
Thank you to [Richard Zijdeman](https://www.clariah.nl/nl/personen/richard-zijdeman) and [Carlos Martinez-Ortiz](https://www.esciencecenter.nl/team/dr-carlos-martinez-ortiz/) for input and feedback on the design of [rosemary](http://github/yasgui-with-rosemary/app), and to [CLARIAH](https://www.clariah.nl/) for funding the development.


