import styles from "./GradeComponent.module.css";
import { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, { forwardRef } from "react";
import COMMENTS from "./MOCK_DATA.json";
import { GrDrag } from "react-icons/gr";
import moment from "moment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const GradeComponent = () => {


  // GRADE STRUCTURE
  const [gradeStructure, setGradeStructure] = useState(COMMENTS);
  const [gradeStructureClone, setGradeStructureClone] = useState([])

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

  const handleAddGradeItem = () => {
    const item = { "_id": "23f", "name": nameGrade, "scale": scaleGrade, "_public": false }
    setGradeStructure(prev => [...prev, item])

    setNameGrade('')
    setScaleGrade('')
    setShow(false)
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
    setGradeStructure(gradeStructureClone)
    setEditGradeStructure(false)
  }

  const handleEditCancel = () => {
    setEditGradeStructure(false)
  }


  // PART 2

  return (
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
                            editScale = {editScaleGrade}
                            editPublic = {editPublicGrade}
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
    </div>
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
  ({ _id, name, scale, _public, dragHandleProps, snapshot, edit, remove,editName,editScale,editPublic, ...props }, ref) => {

    const [nameValue, setNameValue] = useState(name)
    const [scaleValue, setScaleValue] = useState(scale)
    const [isPublic, setIsPublic] = useState(_public)

    useEffect(()=>{
      setNameValue(name)
      setScaleValue(scale)
      setIsPublic(_public)
    },[edit])

    const handleEditName = (e) => {
      setNameValue(e.target.value)
      editName(_id,e.target.value)
    }

    const handleEditScale = (e) => {
      setScaleValue(e.target.value)
      editScale(_id,e.target.value)
    }

    const handleEditPublic = () => {
      setIsPublic(!isPublic)
      editPublic(_id,!isPublic)
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

        <div class={`form-check ${styles['grade-item-field']}`}>
          <input onChange={handleEditPublic} checked={isPublic} disabled={!edit} style={{ width: '1.2rem', height: '1.2rem', cursor: "pointer" }} class={`form-check-input`} type="checkbox" value="" id="flexCheckIndeterminate" />
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
