import styles from "./GradeComponent.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, { forwardRef } from "react";
import { GrDrag } from "react-icons/gr";
import moment from "moment";
import AuthContext from "../../../store/auth-context";
import toast, { useToaster } from "react-hot-toast";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import GradeItem from "./GradeItem/GradeItem";
import Dropdown from 'react-bootstrap/Dropdown';
import StudentProfile from "./StudentProfile/StudentProfile";
import { Outlet, useLocation, useParams, NavLink } from "react-router-dom";


const GradeComponent = () => {
  const { grade_id } = useParams();
  const { id } = useParams()



  // GENERAL
  const [loading, setLoading] = useState(true)
  const [gradeValue, setGradeValue] = useState([])

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('role') === 'teacher') {
      if (!loading) {
        setLoading(true)

        axios.post(process.env.REACT_APP_API_HOST + 'grade/get-grade', { id: grade_id }, { headers })
          .then((res) => {
            if (res.data.status === "success") {
              setGradeValue(res.data.value)
              setLoading(false)
            }
            else {
            }
          });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem('role') === 'teacher') {
      axios.post(process.env.REACT_APP_API_HOST + 'grade/get-grade', { id: grade_id }, { headers })
        .then((res) => {
          if (res.data.status === "success") {
            setGradeValue(res.data.value)
            setLoading(false)
          }
          else { }
        });
    }
  }, [])

  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "5px",
      color: "#28a745",
      fontWeight: "500",
    },
    duration: 4000,
  };

  const styleError = {
    style: {
      border: "2px solid red",
      padding: "10px",
      color: "red",
      fontWeight: "500",
    },
    duration: 4000,
  };

  let toastId
  const loadingToast = () => {
    toastId = toast(
      (t) => (
        <div className="notification-up w-100 p-0">
          <div
            style={{ width: "1.6rem", height: "1.6rem", color: "#5D5FEF", marginRight: "1rem" }}
            className="spinner-border"
            role="status"
          ></div>
          <p className="p-0 m-0" style={{ color: "#5D5FEF" }}>Loading...</p>
        </div>
      ),
      {
        duration: 600000,
        style: {
          cursor: "pointer",
          width: "10rem",
          border: "2px solid #5D5FEF",
          padding: "5px",
        },
      }
    );
  }
  const dismissToast = () => {
    toast.dismiss(toastId)
  }

  // PART 1: GRADE STRUCTURE
  const [gradeStructure, setGradeStructure] = useState([]);
  const [gradeStructureClone, setGradeStructureClone] = useState([])

  useEffect(() => {
    if (gradeValue.structure) {
      setGradeStructure(gradeValue.structure)
    }
  }, [gradeValue])

  const dragEnded = (param) => {
    const { source, destination } = param;
    if (!param.destination) return;
    let _arr = [...gradeStructureClone];
    const _item = _arr.splice(source.index, 1)[0];
    _arr.splice(destination.index, 0, _item);
    setGradeStructureClone(_arr);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setNameGrade('')
    setScaleGrade('')
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const [nameGrade, setNameGrade] = useState('')
  const [scaleGrade, setScaleGrade] = useState('')

  const randomId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleAddGradeItem = () => {
    const data = {
      id: grade_id,
      value: {
        '_id': randomId(),
        'name': nameGrade,
        'scale': scaleGrade,
        '_public': false
      }
    }
    loadingToast()
    axios.post(process.env.REACT_APP_API_HOST + 'grade/add-structure', data, { headers })
      .then((res) => {
        dismissToast()
        if (res.data.status === "success") {
          setGradeStructure(res.data.value.structure)
          setGrades(res.data.value.grades)
          setNameGrade('')
          setScaleGrade('')
          toast.success('Add successfully!', styleSuccess);
          setShow(false)
        }
        else {
          toast.error(res.data.value, styleError);
        }
      });

  }
  const [addEnable, setAddEnable] = useState(true)

  useEffect(() => {
    if (nameGrade.length > 0 && scaleGrade > 0) {
      const number = parseInt(scaleGrade, 10)
      if (!isNaN(number) && Number.isInteger(number) && number >= 1 && number <= 100) {
        setAddEnable(false)
      }
      else {
        setAddEnable(true)
      }
    }
    else setAddEnable(true)
  }, [nameGrade, scaleGrade])

  const [editGradeStructure, setEditGradeStructure] = useState(false)

  const handleEdit = () => {
    setEditGradeStructure(true)
    setGradeStructureClone(gradeStructure)
  }

  const removeGradeItem = (_id) => {
    setGradeStructureClone(gradeStructureClone.filter(item => item._id !== _id))
  }

  const editNameGrade = (_id, value) => {
    const updatedData = gradeStructureClone.map(item => {
      if (item._id === _id) {
        return {
          ...item,
          name: value,
        };
      }
      return item;
    });
    setGradeStructureClone(updatedData)
  }

  const editScaleGrade = (_id, value) => {
    const updatedData = gradeStructureClone.map(item => {
      if (item._id === _id) {
        return {
          ...item,
          scale: value,
        };
      }
      return item;
    });
    setGradeStructureClone(updatedData)
  }

  const [publicEdit, setPublicEdit] = useState([])

  const editPublicGrade = (_id, value) => {
    const updatedData = gradeStructureClone.map(item => {
      if (item._id === _id) {
        if (value) setPublicEdit(prev => [...prev, item.name])
        else {
          if (publicEdit.includes(item.name)) {
            setPublicEdit(publicEdit.filter(i => i !== item.name))
          }
        }
        return {
          ...item,
          _public: value,
        };
      }
      return item;
    });
    setGradeStructureClone(updatedData)
  }

  const handleEditDone = () => {

    const data = {
      id: grade_id,
      value: gradeStructureClone,
      publicList: publicEdit,
      class_id: id,
      username: authCtx.userData.username
    }
    loadingToast()
    axios.post(process.env.REACT_APP_API_HOST + 'grade/edit-structure', data, { headers })
      .then((res) => {
        dismissToast()
        if (res.data.status === "success") {
          setGradeStructure(res.data.value.structure)
          setGrades(res.data.value.grades)
          setEditGradeStructure(false)
          setPublicEdit([])
          toast.success('Edit successfully!', styleSuccess);
        }
        else {
          toast.error(res.data.value, styleError);
        }
      });
  }

  const handleEditCancel = () => {
    setEditGradeStructure(false)
  }

  function calculateScaleTotal(dataArray) {
    let scaleTotal = 0;

    for (const item of dataArray) {
      const scaleValue = parseInt(item.scale, 10);
      scaleTotal += scaleValue;
    }

    return scaleTotal;
  }

  // PART 2: STUDENT LIST
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    if (gradeValue.grades) {
      setStudentList(gradeValue.grades)
    }
  }, [gradeValue])

  const exportStudentListToExcel = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(
      [{ 'StudentId': '', 'FullName': '' }]
    );

    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'student-list-template.xlsx')

  };

  const fileInputRef = useRef(null);

  const _handleUploadStudentList = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadStudentList = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          let jsonData = XLSX.utils.sheet_to_json(worksheet);

          const containsStudentId = jsonData.every((row) => row.StudentId !== undefined);
          const containsFullName = jsonData.every((row) => row.FullName !== undefined && row.FullName.length > 0);

          // const isValidData = jsonData.every((row) => {
          //   const hasStudentId = row.StudentId !== undefined && row.StudentId !== null && row.StudentId !== '';
          //   const hasFullName = row.FullName !== undefined && row.FullName !== null && row.FullName !== '';

          //   return hasStudentId && hasFullName;
          // });
          console.log(jsonData)

          if (containsStudentId && containsFullName) {
            jsonData = jsonData.map((item) => {
              return { _id: '', studentId: item.StudentId.toString(), fullname: item.FullName.toString() };
            });
            setStudentList(jsonData)
            toast.success('Upload data is success!', styleSuccess)


            const data = {
              id: grade_id,
              value: jsonData
            }

            axios.post(process.env.REACT_APP_API_HOST + 'grade/update-student-list', data, { headers })
              .then((res) => {
                if (res.data.status === "success") {
                  console.log(res.data.value)
                  setStudentList(res.data.value)
                  setGrades(res.data.value)
                }
                else {
                  toast.error(res.data.value, styleError);
                }
              });

          } else {
            toast.error('The uploaded file is not in the correct format (StudentId, FullName)', styleError)
          }

          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        } catch (error) {
          console.error('Lỗi khi chuyển đổi file Excel:', error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // PART 3
  const [grades, setGrades] = useState([]);
  const [gradesClone, setGradesClone] = useState([])


  useEffect(() => {
    if (gradeValue.grades) {
      setGrades(gradeValue.grades)
    }
  }, [gradeValue])

  const [editGrade, setEditGrade] = useState(false)
  const handleEditGrade = () => {
    setEditGrade(!editGrade)
    setGradesClone(grades)
  }

  const onChangeEdit = (value, _index) => {
    const updatedData = gradesClone.map((item, index) => {
      if (_index === index) {
        return value
      }
      return item
    });
    setGradesClone(updatedData)
  }

  const handleEditGradeDone = () => {
    const data = {
      id: grade_id,
      value: gradesClone
    }
    loadingToast()
    axios.post(process.env.REACT_APP_API_HOST + 'grade/edit-grades', data, { headers })
      .then((res) => {
        dismissToast()
        if (res.data.status === "success") {
          setGrades(res.data.value)
          setEditGrade(!editGrade)
          toast.success('Edit successfully!', styleSuccess);
        }
        else {
          toast.error(res.data.value, styleError);
        }
      });
  }

  const _weekScale = (gradeStructure, weekName) => {
    const week = gradeStructure.find(week => week.name === weekName);
    return week ? parseInt(week.scale) : 0;
  };

  const handleExportGradeBoard = () => {
    const wb = XLSX.utils.book_new();

    const columns = gradeStructure.map(week => week.name);
    const sheetData = grades.map(student => {
      const total = columns.reduce((acc, column) => {
        const weekScore = parseFloat(student.grade[column]) || 0;
        const weekScale = parseInt(_weekScale(gradeStructure, column)) || 0;
        return acc + weekScore * weekScale;
      }, 0);

      const roundedTotal = Math.round(total * 0.01 * 100) / 100;
      console.log(roundedTotal)
      return {
        'StudentId': student.studentId,
        ...student.grade,
        'Total': roundedTotal,
      };
    });

    const ws = XLSX.utils.json_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    XLSX.writeFile(wb, 'student-grades.xlsx');
  }

  const [showDowloadModal, setShowDownloadModal] = useState(false)
  const [downloadTemplateValue, setDownloadTemplateValue] = useState()

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    let sheetData;
    let name = ''
    if (downloadTemplateValue === 'all') {
      sheetData = grades.map(student => ({
        'StudentId': student.studentId,
        ...Object.keys(student.grade).reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {}),
      }));
    } else {
      name = downloadTemplateValue
      sheetData = grades.map(student => ({
        'StudentId': student.studentId,
        [downloadTemplateValue]: '',
      }));
    }

    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `grade-board-template-${name}.xlsx`);

    setShowDownloadModal(false)
  }

  const gradeFileInputRef = useRef(null);

  const _handleUploadGradeBoard = () => {
    if (gradeFileInputRef.current) {
      gradeFileInputRef.current.click();
    }
  };

  const handleUploadGradeBoard = (event) => {

    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          let jsonData = XLSX.utils.sheet_to_json(worksheet);

          const containsStudentId = jsonData.every((row) => row.StudentId !== undefined);


          for (const boardItem of jsonData) {
            const studentItem = grades.find(student => student.studentId === boardItem.StudentId);

            if (studentItem) {
              for (const weekKey in boardItem) {
                if (weekKey !== "StudentId") {
                  if (studentItem.grade.hasOwnProperty(weekKey)) {
                    studentItem.grade[weekKey] = boardItem[weekKey].toString();
                  }
                }
              }
            }
          }

          if (containsStudentId) {
            setGrades(grades)

            const data = {
              id: grade_id,
              value: grades
            }

            axios.post(process.env.REACT_APP_API_HOST + 'grade/edit-grades', data, { headers })
              .then((res) => {
                if (res.data.status === "success") {
                  setGrades(res.data.value)
                  toast.success('Upload data is success!', styleSuccess)
                }
                else {
                  toast.error('Upload data failed! ' + res.data.value, styleError);
                }
              });

          } else {
            toast.error('', styleError)
          }

          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        } catch (error) {
          console.error('Lỗi khi chuyển đổi file Excel:', error);
        }
      };

      reader.readAsArrayBuffer(file);
    }

  }


  const [showProfileModal, setShowProfileModal] = useState(false)
  const [studentProfile, setStudentProfile] = useState({})
  const handleShowProfile = (id) => {
    setShowProfileModal(true)

    axios.post(process.env.REACT_APP_API_HOST + 'auth/get-user-by-id', { _id: id }, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setStudentProfile(res.data.data)
        }
        else {
        }
      });
  }


  // Part 2 student
  const [studentGrade, setStudentGrade] = useState({})
  const [studentGradeStructure, setStudentGradeStructure] = useState([])

  const loadStudentData = () => {
    const data = {
      id: localStorage.getItem('_id'),
      grade_id: grade_id
    }

    axios.post(process.env.REACT_APP_API_HOST + 'grade/get-grade-by-student-id', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setStudentGrade(res.data.grade)
          setStudentGradeStructure(res.data.gradeStructure)
          setLoading(false)
        }
        else {
        }

      });
  }

  useEffect(() => {
    if (localStorage.getItem('role') === 'student' && !loading) {
      setLoading(true)
      loadStudentData()
    }
  }, [location.pathname]);

  useEffect(() => {
    loadStudentData()
  }, [])


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !addEnable) {
      handleAddGradeItem();
    }
  };


  return (
    localStorage.getItem("role") === "teacher" ? <>{
      loading ?
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        :
        <div className={`${styles["grade-container"]}`}>
          {/* add new structure modal */}
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Add Grade</h4>
            </Modal.Header>
            <Modal.Body>
              <div onKeyDown={(e) => handleKeyDown(e)}>
                <Form className="form-container">
                  <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setNameGrade(event.target.value);
                      }}
                      value={nameGrade}
                      className="form-control-container"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label>Scale (%)</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setScaleGrade(event.target.value);
                      }}
                      value={scaleGrade}
                      className="form-control-container"
                    />
                  </Form.Group>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={handleAddGradeItem}
                disabled={addEnable}
              >
                Add
              </Button>
            </Modal.Footer>
          </Modal>;

          {/* download file modal */}
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showDowloadModal}
            onHide={() => { setShowDownloadModal(false) }}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Download template</h4>
            </Modal.Header>
            <Modal.Body>
              <Form className="form-container">
                <Form.Group className="mb-5" controlId="formGridAddress1">
                  <Form.Label>Column</Form.Label>
                  <Form.Select onChange={(e) => { setDownloadTemplateValue(e.target.value) }}>
                    {gradeStructure.map((value, index) => <option value={value.name}>{value.name}</option>)}
                    <option value="all">All columns</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={() => { setShowDownloadModal(false) }}
              >
                Close
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={handleDownloadTemplate}
              >
                Download
              </Button>
            </Modal.Footer>
          </Modal>
          {/* student profile modal */}
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showProfileModal}
            onHide={() => { setShowProfileModal(false); setStudentProfile({}) }}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Profile</h4>
            </Modal.Header>
            <Modal.Body>
              <StudentProfile value={studentProfile} />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={() => { setShowProfileModal(false); setStudentProfile({}) }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-5`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Grade structure</h3>
            <div className={`d-flex align-items-center justify-content-between`}>
              {!editGradeStructure && <Button
                onClick={handleShow}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-1`}
                type="submit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512">
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                Add
              </Button>}
              {!editGradeStructure && gradeStructure.length > 0 && <Button
                onClick={handleEdit}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
                Edit
              </Button>}

              {editGradeStructure && <Button
                onClick={handleEditCancel}
                className={`${styles['grade-structure-cancel-button']} p-0`}
                type="submit"
              >
                Cancel
              </Button>}
              {editGradeStructure && <Button
                onClick={handleEditDone}
                className={`${styles['grade-structure-done-button']} p-0`}
                type="submit"
              >
                Done
              </Button>}
            </div>
          </div>
          <div className={`${styles['grade-structure-field']} gap-0 d-flex align-items-center rounded-2`}>
            <p className={`w-50 mb-0`}>Name</p>
            <p className={`p-0 mb-0 ml-0`}>Scale (%)</p>
            <p className={`p-0 mb-0`}>Finalize</p>
          </div>
          <div className="w-100">
            {!gradeStructure.length > 0 ? <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
              <p className="p-0 m-0">No data available...</p>
            </div> : <div style={{ height: `${3.3 * gradeStructure.length}rem` }}>
              <DragDropContext onDragEnd={dragEnded} >
                <Droppable droppableId="comments-wrapper">
                  {(provided, snapshot) => (
                    <StructureItems ref={provided.innerRef} {...provided.droppableProps}>

                      {!editGradeStructure ? gradeStructure.map((_comment, index) => {
                        return (
                          <Draggable
                            draggableId={`comment-${_comment._id}`}
                            index={index}
                            key={_comment._id}
                          >
                            {(_provided, _snapshot) => (
                              <StructureItem
                                ref={_provided.innerRef}
                                dragHandleProps={_provided.dragHandleProps}
                                {..._provided.draggableProps}
                                snapshot={_snapshot}
                                {..._comment}
                                edit={editGradeStructure}
                                remove={removeGradeItem}
                              />
                            )}

                          </Draggable>
                        );
                      }) :
                        gradeStructureClone.map((_comment, index) => {
                          return (
                            <Draggable
                              draggableId={`comment-${_comment._id}`}
                              index={index}
                              key={_comment._id}
                            >
                              {(_provided, _snapshot) => (
                                <StructureItem
                                  ref={_provided.innerRef}
                                  dragHandleProps={_provided.dragHandleProps}
                                  {..._provided.draggableProps}
                                  snapshot={_snapshot}
                                  {..._comment}
                                  edit={editGradeStructure}
                                  remove={removeGradeItem}
                                  editName={editNameGrade}
                                  editScale={editScaleGrade}
                                  editPublic={editPublicGrade}
                                />
                              )}

                            </Draggable>
                          );
                        })
                      }

                      {/* {provided.placeholder} */}
                    </StructureItems>
                  )}
                </Droppable>
              </DragDropContext>
            </div>}
          </div>
          {<div className={`d-flex align-items-center`} style={{ height: '2rem', paddingTop: '1rem' }}>
            {!editGradeStructure && <p>Total scale: </p>}
            {!editGradeStructure && <p style={{ fontWeight: '600', color: '#5d5fef' }}>{calculateScaleTotal(gradeStructure)}%</p>}
          </div>}
          {/*========================= PART 2 =========================*/}
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-5`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Student list</h3>
            <div className={`d-flex align-items-center justify-content-between`}>
              <Button
                onClick={exportStudentListToExcel}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                Download template
              </Button>
              {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
              <Button
                onClick={_handleUploadStudentList}
                style={{ cursor: 'pointer' }}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                  <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" /></svg>
                Upload file
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleUploadStudentList}
                />
              </Button>
            </div>
          </div>
          <div className={`${styles['student-list-field']} mt-3 gap-0 d-flex align-items-center rounded-2`}>
            <p className={`mb-0`}>#</p>
            <p className={`mb-0 ml-0`}>Student ID</p>
            <p className={`mb-0`}>Full name</p>
            {/* <p className={`p-0 mb-0`}>Account</p> */}
          </div>
          {!studentList.length > 0 ? <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
            <p className="p-0 m-0">No data available...</p>
          </div>
            : <div>
              {studentList.map((value, index) => <div
                key={value.studentId}
                className={
                  `${styles['student-list-item']} d-flex align-items-center card p-2 mt-2`
                }
              >
                <div className={`${styles['student-item-field']}`}>
                  <small className="ml-2 text-dark">{index + 1}</small>
                </div>

                <div className={`${styles['student-item-field']} `}>
                  <small onClick={() => { handleShowProfile(value._id) }} style={{ textDecoration: `${value._id.length > 1 ? 'underline' : ''}`, cursor: `${value._id.length > 1 ? 'pointer' : ''}` }}>{value.studentId}</small>
                </div>

                <div className={`${styles['student-item-field']}`}>
                  <small>{value.fullname}</small>
                </div>

              </div>)}
            </div>}
          {/*========================= PART 3 =========================*/}
          <div style={{ marginTop: '4rem' }} className={`d-flex align-items-center justify-content-between mb-3`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Grade board</h3>
            <div className={`d-flex align-items-center justify-content-between`}>
              {!editGrade && grades.length > 0 && <Button
                onClick={handleEditGrade}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
                Edit
              </Button>}
              {!editGrade &&
                <div className={`${styles["dropdown"]}`}>
                  <Dropdown>
                    <Dropdown.Toggle
                      className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
                      id="dropdown-basic">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                      Download file
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item className={`${styles['download-file-option']}`} onClick={() => { setShowDownloadModal(true); setDownloadTemplateValue(gradeStructure[0].name) }} style={{ color: '#2C2C66' }} href="">Download template</Dropdown.Item>
                      <Dropdown.Item className={`${styles['download-file-option']}`} onClick={handleExportGradeBoard} style={{ color: '#2C2C66' }} href="">Export grade board</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
              }
              {!editGrade && <Button
                onClick={_handleUploadGradeBoard}
                style={{ cursor: 'pointer' }}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                  <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" /></svg>
                Upload file
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={gradeFileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleUploadGradeBoard}
                />
              </Button>}
              {editGrade && <Button
                onClick={() => { setEditGrade(!editGrade) }}
                className={`${styles['grade-structure-cancel-button']} p-0`}
                type="submit"
              >
                Cancel
              </Button>}
              {editGrade && <Button
                onClick={handleEditGradeDone}
                className={`${styles['grade-structure-done-button']} p-0`}
                type="submit"
              >
                Done
              </Button>}
            </div>
          </div>

          <div className={`${styles['grades-field']}  mt-3 gap-0 d-flex align-items-center rounded-2`}>
            <p className={`mb-0`}>#</p>
            <p style={{ width: `18%`, fontWeight: 'bold' }} className={`mb-0 ml-0`}>Student ID</p>
            <div style={{ width: '75%' }} className={`d-flex align-items-center`}>
              {gradeStructure.map((value, index) =>
                <p style={{ width: `${75 / gradeStructure.length + 1}%`, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} className={`m-0 p-0`}>{value.name}</p>
              )}
              <p style={{ width: `${75 / gradeStructure.length + 1}%`, fontWeight: 'bold' }} className={`p-0 mb-0`}>Total</p>
            </div>
          </div>
          {!grades.length > 0 ? <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
            <p className="p-0 m-0">No data available...</p>
          </div>
            : <div>
              {grades.map((value, index) =>
                <GradeItem onShowProfile={handleShowProfile} edit={editGrade} onChangeEdit={onChangeEdit} structure={gradeStructure} index={index} value={value} />
              )}
            </div>}
        </div>
    }</> : <>
      {loading ?
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div> :
        <div>
          {/* STUDENT PART 1 */}
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-5`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Grade structure</h3>
          </div>
          <div className={`${styles['grade-structure-field']} gap-0 d-flex align-items-center rounded-2`}>
            <p className={`w-50 mb-0`}>Name</p>
            <p className={`p-0 mb-0 ml-0`}>Scale (%)</p>
          </div>
          <div className="w-100">
            {studentGradeStructure.map((value, index) => <div
              key={value.studentId}
              className={
                `${styles['student-list-item']} d-flex align-items-center card p-2 mt-2`
              }
            >
              <small style={{ width: '50%', marginLeft: '4rem' }}>{value.name}</small>
              <small style={{ width: '10%' }}>{value.scale}</small>
            </div>)}
          </div>
          {<div className={`d-flex align-items-center`} style={{ height: '2rem', paddingTop: '2rem' }}>
            {<p>Total scale: </p>}
            {<p style={{ fontWeight: '600', color: '#5d5fef' }}>{calculateScaleTotal(studentGradeStructure)}%</p>}
          </div>}
          {/* STUDENT PART 2 */}
          <div style={{ marginTop: '4rem' }} className={`d-flex align-items-center justify-content-between mb-3`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Your grade</h3>
          </div>
          <div className={`${styles['grades-field']}  mt-3 gap-0 d-flex align-items-center rounded-2`}>
            <p className={`mb-0`}>#</p>
            <p style={{ width: `18%`, fontWeight: 'bold' }} className={`mb-0 ml-0`}>Student ID</p>
            <div style={{ width: '75%' }} className={`d-flex align-items-center`}>
              {studentGradeStructure.map((value, index) =>
                <p style={{ width: `${75 / studentGradeStructure.length + 1}%`, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} className={`m-0 p-0`}>{value.name}</p>
              )}
              <p style={{ width: `${75 / studentGradeStructure.length + 1}%`, fontWeight: 'bold' }} className={`p-0 mb-0`}>Total</p>
            </div>
          </div>
          {Object.keys(studentGrade).length === 0 ? <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
            <p className="p-0 m-0">You haven't added a student ID yet or the teacher hasn't completed the grade sheet</p>
          </div>
            : <div>
              <GradeItem index={0} onShowProfile={handleShowProfile} edit={editGrade} onChangeEdit={onChangeEdit} structure={studentGradeStructure} value={studentGrade} />
            </div>}
        </div>}
    </>
  );
};

// >>>>>>>>>>>>>>>>>>>>>>>>> Graggable >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const StructureItems = forwardRef(({ children, ...props }, ref) => {
  return (
    <ul ref={ref} className={`${styles['grade-items']} p-0`}>
      {children}
    </ul>
  );
});

const StructureItem = forwardRef(
  ({ _id, name, scale, _public, dragHandleProps, snapshot, edit, remove, editName, editScale, editPublic, ...props }, ref) => {

    const [nameValue, setNameValue] = useState(name)
    const [scaleValue, setScaleValue] = useState(scale)
    const [isPublic, setIsPublic] = useState(_public)

    useEffect(() => {
      setNameValue(name)
      setScaleValue(scale)
      setIsPublic(_public)
    }, [edit])

    const handleEditName = (e) => {
      setNameValue(e.target.value)
      editName(_id, e.target.value)
    }

    const handleEditScale = (e) => {
      setScaleValue(e.target.value)
      editScale(_id, e.target.value)
    }

    const handleEditPublic = () => {
      setIsPublic(!isPublic)
      editPublic(_id, !isPublic)
    }

    const handleRemove = () => {
      remove(_id)
    }


    return (
      <div
        ref={ref}
        {...props}
        className={
          `${styles['structure-item']} d-flex align-items-center card p-2`
        }
      >
        <span {...dragHandleProps} className={`${styles['structure-item-on-hand']}`}>
          {edit && <GrDrag />}
        </span>

        <div className={`${styles['structure-item-field']} w-50`}>
          {!edit ? <small className="ml-2 text-dark">{name}</small>
            :
            <input type="text" onChange={handleEditName} value={nameValue} className={`${styles['']} form-control rounded-1`}   ></input>
          }
        </div>

        <div className={`${styles['structure-item-field']} `}>
          {!edit ? <small>{scale}</small> :
            <input type="text" onChange={handleEditScale} value={scaleValue} className={`${styles['']} form-control rounded-1`}   ></input>
          }
        </div>

        <div className={`form-check ${styles['structure-item-field']}`}>
          <input onChange={handleEditPublic} checked={isPublic} disabled={!edit} style={{ width: '1.2rem', height: '1.2rem', cursor: "pointer" }} className={`form-check-input`} type="checkbox" value="" id="flexCheckIndeterminate" />
        </div>

        {edit && <Button
          onClick={handleRemove}
          className={`${styles['structure-item-field']}`}
          type="submit"
        ><svg xmlns="http://www.w3.org/2000/svg" height="14" width="11" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
        </Button>}

      </div>
    );
  }

);

export default GradeComponent;
