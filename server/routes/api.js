const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");

// Middleware
const {
  authenticate
} = require("./../middleware/authenticate");

// Models
const {
  Document
} = require("./../models/document");

const {
  DocumentType
} = require("./../models/document_type");

const {
  Faculty
} = require("./../models/faculty");

const {
  DocumentVisibility
} = require("./../models/document_visibility");

const {
  Section
} = require("./../models/section");

router.post("/getFaculties", authenticate, (req, res) => {
  Faculty.getFaculties().then((faculties) => {
    res.status(200).send(faculties);
  }).catch((e) => {
    res.status(401).send(e);
  });
});

router.post("/getDocumentTypes", (req, res) => {
  DocumentType.getDocumentTypes().then((documentTypes) => {
    res.status(200).send(documentTypes);
  }).catch((e) => {
    res.status(401).send(e);
  });
});

router.post("/getSubjectsByFaculty", (req, res) => {
  Faculty.getSubjectsByFaculty(req.body._id).then((subjects) => {
    res.status(200).send(subjects);
  }).catch((e) => {
    res.status(401).send(e);
  });
});

router.post("/getDocumentVisibilityList", (req, res) => {
  DocumentVisibility.getDocumentVisibility()
    .then((visibilities) => {
      res.status(200).send(visibilities);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/getSections", (req, res) => {
  Section.getSections()
    .then((sections) => {
      res.status(200).send(sections);
    }).catch((e) => {
      res.status(200).send(e)
    });
});

module.exports = router;