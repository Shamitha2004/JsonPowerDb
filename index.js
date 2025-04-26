console.log("This is Shamitha's Login2Xplore assignment 🚀");

// Base URLs and Credentials
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const dbName = "SCHOOL-DB";
const relationName = "STUDENT-TABLE";
const connToken = "90931744|-31949307231931541|90963389";

// Save Record Number to Local Storage
const saveRecNoToLocalStorage = (response) => {
  const data = JSON.parse(response.data);
  localStorage.setItem("recno", data.rec_no);
};

// Get Roll Number as JSON Object
const getRollNoAsJson = () => {
  const rollNo = $("#rollno").val();
  return JSON.stringify({ id: rollNo });
};

// Fill Form Data
const fillFormData = (response) => {
  saveRecNoToLocalStorage(response);
  const record = JSON.parse(response.data).record;
  
  $("#studentName").val(record.name);
  $("#studentClass").val(record.class);
  $("#birthDate").val(record.birthDate);
  $("#address").val(record.address);
  $("#enrollmentDate").val(record.enrollmentDate);
};

// Reset Form
const resetForm = () => {
  $("#rollno, #studentName, #studentClass, #birthDate, #address, #enrollmentDate").val("");
  $("#rollno").prop("disabled", false);
  $("#save, #change, #reset").prop("disabled", true);
  $("#rollno").focus();
};

// Validate Form Data
const validateFormData = () => {
  const rollNo = $("#rollno").val();
  const studentName = $("#studentName").val();
  const studentClass = $("#studentClass").val();
  const birthDate = $("#birthDate").val();
  const address = $("#address").val();
  const enrollmentDate = $("#enrollmentDate").val();

  if (!rollNo) {
    alert("Roll Number is required.");
    $("#rollno").focus();
    return "";
  }
  if (!studentName) {
    alert("Student Name is required.");
    $("#studentName").focus();
    return "";
  }
  if (!studentClass) {
    alert("Student Class is required.");
    $("#studentClass").focus();
    return "";
  }
  if (!birthDate) {
    alert("Birth Date is required.");
    $("#birthDate").focus();
    return "";
  }
  if (!address) {
    alert("Address is required.");
    $("#address").focus();
    return "";
  }
  if (!enrollmentDate) {
    alert("Enrollment Date is required.");
    $("#enrollmentDate").focus();
    return "";
  }

  const formData = {
    id: rollNo,
    name: studentName,
    class: studentClass,
    birthDate: birthDate,
    address: address,
    enrollmentDate: enrollmentDate,
  };

  return JSON.stringify(formData);
};

// Get Student Details
const getStudent = () => {
  const rollNoJson = getRollNoAsJson();
  const getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, rollNoJson);
  
  jQuery.ajaxSetup({ async: false });
  const response = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  console.log(response);

  if (response.status === 400) {
    $("#save, #reset").prop("disabled", false);
    $("#studentName").focus();
  } else if (response.status === 200) {
    $("#rollno").prop("disabled", true);
    fillFormData(response);
    $("#change, #reset").prop("disabled", false);
    $("#studentName").focus();
  }
};

// Save New Student Data
const saveData = () => {
  const jsonData = validateFormData();
  if (!jsonData) return;

  const putRequest = createPUTRequest(connToken, jsonData, dbName, relationName);
  
  jQuery.ajaxSetup({ async: false });
  const response = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  console.log(response);

  resetForm();
};

// Change Existing Student Data
const changeData = () => {
  $("#change").prop("disabled", true);

  const updatedData = validateFormData();
  const updateRequest = createUPDATERecordRequest(
    connToken,
    updatedData,
    dbName,
    relationName,
    localStorage.getItem("recno")
  );

  jQuery.ajaxSetup({ async: false });
  const response = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  console.log(response);

  resetForm();
};
