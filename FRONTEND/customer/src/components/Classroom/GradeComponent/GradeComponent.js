import styles from "./GradeComponent.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, { forwardRef } from "react";
import COMMENTS from "./MOCK_DATA.json";
import { GrDrag } from "react-icons/gr";
import moment from "moment";
import AuthContext from "../../../store/auth-context";
import toast from "react-hot-toast";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const GradeComponent = (props) => {

  // GENERAL
  const [loading, setLoading] = useState(true)
  const [gradeValue, setGradeValue] = useState([])

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.post(process.env.REACT_APP_API_HOST + 'grade/get-grade', { id: props.id }, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setGradeValue(res.data.value)
          setLoading(false)
        }
        else { }
      });
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


  // PART 1: GRADE STRUCTURE
  const [gradeStructure, setGradeStructure] = useState([]);
  const [gradeStructureClone, setGradeStructureClone] = useState([])

  useEffect(() => {
    if (gradeValue.structure) setGradeStructure(gradeValue.structure)
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
      id: props.id,
      value: {
        '_id': randomId(),
        'name': nameGrade,
        'scale': scaleGrade,
        '_public': false
      }
    }

    axios.post(process.env.REACT_APP_API_HOST + 'grade/add-structure', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setGradeStructure(prev => [...prev, res.data.value])
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

  const editPublicGrade = (_id, value) => {
    const updatedData = gradeStructureClone.map(item => {
      if (item._id === _id) {
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
      id: props.id,
      value: gradeStructureClone
    }

    axios.post(process.env.REACT_APP_API_HOST + 'grade/edit-structure', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setGradeStructure(res.data.value)
          setEditGradeStructure(false)
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
      // Chuyển đổi giá trị 'scale' thành số và kiểm tra xem có phải là số hay không
      const scaleValue = parseInt(item.scale, 10);
      if (!isNaN(scaleValue)) {
        scaleTotal += scaleValue;
      }
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
          const containsFullName = jsonData.every((row) => row.FullName !== undefined);

          // const isValidData = jsonData.every((row) => {
          //   const hasStudentId = row.StudentId !== undefined && row.StudentId !== null && row.StudentId !== '';
          //   const hasFullName = row.FullName !== undefined && row.FullName !== null && row.FullName !== '';

          //   return hasStudentId && hasFullName;
          // });


          if (containsStudentId && containsFullName) {
            jsonData = jsonData.map((item) => {
              return { _id: '', studentId: item.StudentId.toString(), fullname: item.FullName.toString() };
            });
            setStudentList(jsonData)
            toast.success('Upload data is success!', styleSuccess)

            const data = {
              id: props.id,
              value: jsonData
            }

            axios.post(process.env.REACT_APP_API_HOST + 'grade/update-student-list', data, { headers })
              .then((res) => {
                if (res.data.status === "success") {
                  // console.log(res.data.value)
                  setStudentList(res.data.value)
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

  return (
    <>{
      loading ?
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        :
        <div className={`${styles["grade-container"]}`}>
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
          </Modal>
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-5`}>
            <h3 className={`${styles['grade-structure-title']} m-0`}>Grade structure</h3>
            <div className={`d-flex align-items-center justify-content-between`}>
              {!editGradeStructure && <Button
                onClick={handleShow}
                className={`${styles['grade-structure-add-button']} p-0`}
                type="submit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="21" width="21" viewBox="0 0 448 512">
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
              </Button>}
              {!editGradeStructure && <Button
                onClick={handleEdit}
                className={`${styles['grade-structure-edit-button']}`}
                type="submit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
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
            <p className={`p-0 mb-0`}>Public</p>
          </div>
          <div className="w-100">
            {/* rendering comments */}
            <DragDropContext onDragEnd={dragEnded} >
              <Droppable droppableId="comments-wrapper">
                {(provided, snapshot) => (
                  <GradeItems ref={provided.innerRef} {...provided.droppableProps}>

                    {!editGradeStructure ? gradeStructure.map((_comment, index) => {
                      return (
                        <Draggable
                          draggableId={`comment-${_comment._id}`}
                          index={index}
                          key={_comment._id}
                        >
                          {(_provided, _snapshot) => (
                            <GradeItem
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
                              <GradeItem
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
                  </GradeItems>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className={`d-flex align-items-center`}>
            <p>Total scale: </p>
            <p style={{ fontWeight: '600', color: '#5d5fef' }}>{calculateScaleTotal(gradeStructure)}%</p>
          </div>
          {/* PART 2 */}
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-4`}>
            <h3 className={`${styles['grade-structure-title']} mt-0`}>Student list</h3>
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
            <p className={`p-0 mb-0`}>Account</p>
          </div>
          <div>
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
                <small>{value.studentId}</small>
              </div>

              <div className={`${styles['student-item-field']}`}>
                <small>{value.fullname}</small>
              </div>

              {value._id.length > 1 &&
                <div className={`${styles['student-item-field']}`}>
                  <small style={{ color: '#099268', textDecoration: 'underline', cursor: 'pointer' }}>View</small>
                </div>
              }

            </div>)}
          </div>
          {/* PART 3 */}
          <div className={`d-flex align-items-center justify-content-between mb-3 mt-5`}>
            <h3 className={`${styles['grade-structure-title']} mt-0`}>Grade board</h3>
            <div className={`d-flex align-items-center justify-content-between`}>
              <Button
                onClick={() => { }}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
                Edit
              </Button>
              <Button
                onClick={() => { }}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                Download file
              </Button>
              <Button
                onClick={() => { }}
                style={{ cursor: 'pointer' }}
                className={`${styles['student-list-button']} rounded-2 d-flex align-items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                  <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" /></svg>
                Upload file
              </Button>
            </div>
          </div>
        </div>
    }</>

  );
};

const GradeItems = forwardRef(({ children, ...props }, ref) => {
  return (
    <ul ref={ref} className={`${styles['grade-items']} p-0`}>
      {children}
    </ul>
  );
});


const GradeItem = forwardRef(
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
          `${styles['grade-item']} d-flex align-items-center card p-2 mt-2`
        }
      >
        <span {...dragHandleProps} className={`${styles['grade-item-on-hand']}`}>
          {edit && <GrDrag />}
        </span>

        <div className={`${styles['grade-item-field']} w-50`}>
          {!edit ? <small className="ml-2 text-dark">{name}</small>
            :
            <input type="text" onChange={handleEditName} value={nameValue} className={`${styles['']} form-control rounded-1`}   ></input>
          }
        </div>

        <div className={`${styles['grade-item-field']} `}>
          {!edit ? <small>{scale}</small> :
            <input type="text" onChange={handleEditScale} value={scaleValue} className={`${styles['']} form-control rounded-1`}   ></input>
          }
        </div>

        <div className={`form-check ${styles['grade-item-field']}`}>
          <input onChange={handleEditPublic} checked={isPublic} disabled={!edit} style={{ width: '1.2rem', height: '1.2rem', cursor: "pointer" }} className={`form-check-input`} type="checkbox" value="" id="flexCheckIndeterminate" />
        </div>

        {edit && <Button
          onClick={handleRemove}
          className={`${styles['grade-item-field']}`}
          type="submit"
        ><svg xmlns="http://www.w3.org/2000/svg" height="14" width="11" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
        </Button>}

      </div>
    );
  }

);

export default GradeComponent;
