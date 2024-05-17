import { Typography } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";

import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//import Snackbar from "@mui/material/Snackbar";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { useState, useEffect } from "react";
import useIsSmallScreen from "./hooks/useIsSmallScreen";

const serverURL = "https://student-list-be.onrender.com";

interface Student {
  stu_id?: number;
  name: string;
  email: string;
  phone: string;
  enroll_number: string;
  date_of_admission: string;
}

const modalboxStyle = {
  position: "absolute" as "absolute",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",

  gap: 2,

  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.action.hover,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  name: string,
  email: string,
  phone: string,
  enroll_number: string,
  date_of_admission: string
) {
  return { name, email, phone, enroll_number, date_of_admission };
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const initialStudent: Student = {
  name: "",
  email: "",
  phone: "",
  enroll_number: "",
  date_of_admission: "",
};

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

function Main() {
  const [open, setOpen] = React.useState(false);
  const [openedit, setOpenEdit] = React.useState(false);
  const [updateStudent, setUpdateStudent] = useState<Student>(initialStudent);
  const [opendelete, setOpenDelete] = React.useState(false);
  const [searchText, setSearchText] = React.useState<string>("");
  const [studentData, setStudentData] = React.useState<Student[]>([]);
  const [filteredStudentData, setFilteredStudentData] = React.useState<
    Student[]
  >([]);
  const isSmallScreen: boolean = useIsSmallScreen();

  const processStudentData = () => {
    setFilteredStudentData(
      studentData.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase()) ||
          student.phone.toLowerCase().includes(searchText.toLowerCase()) ||
          student.enroll_number
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          student.date_of_admission
            .toLowerCase()
            .includes(searchText.toLowerCase())
      )
    );
  };

  useEffect(() => {
    processStudentData();
  }, [studentData, searchText]);

  const handleEditOpen = (row: Student) => {
    setUpdateStudent(row);
    setOpenEdit(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setOpenEdit(false);
  const handleDeleteOpen = (row: Student) => {
    setUpdateStudent(row);
    setOpenDelete(true);
  };
  const handleDeleteClose = () => setOpenDelete(false);

  const onEditChange = (key: string, value: string) => {
    setUpdateStudent({ ...updateStudent, [key]: value });
  };

  const getStudentsData = () => {
    fetch(serverURL + "/students", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setStudentData(result);
      })
      .catch((error) =>
        console.error(`Error in fetching student data - ${error}`)
      );
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  const onStudentAdd = () => {
    fetch(serverURL + "/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateStudent),
    })
      .then((response) => response.text())
      .then(() => {
        console.info(`Student successfully added!`);
        setUpdateStudent(initialStudent);
        setOpen(false);
        getStudentsData();
      })
      .catch((error) => {
        console.error(`Error in adding student - ${error}`);
        setUpdateStudent(initialStudent);
        setOpen(false);
      });
  };

  const onStudentEdit = () => {
    const tempUpdateStudent = { ...updateStudent };
    delete tempUpdateStudent.stu_id;
    fetch(serverURL + `/student/${updateStudent.stu_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempUpdateStudent),
    })
      .then((response) => response.text())
      .then(() => {
        console.info(`Student updated successfully!`);
        setUpdateStudent(initialStudent);
        setOpenEdit(false);
        getStudentsData();
      })
      .catch((error) => {
        console.error(`Error in updating student - ${error}`);
        setUpdateStudent(initialStudent);
        setOpenEdit(false);
      });
  };

  const onStudentDelete = () => {
    fetch(serverURL + `/student/${updateStudent.stu_id}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then(() => {
        console.info(`Student successfully deleted!`);
        setUpdateStudent(initialStudent);
        setOpenDelete(false);
        getStudentsData();
      })
      .catch((error) => {
        console.error(`Error in deleting student - ${error}`);
        setUpdateStudent(initialStudent);
        setOpenDelete(false);
      });
  };

  return (
    <div className="Main">
      <div className="student-selector">
        <Typography style={{ fontSize: isSmallScreen ? "1.5rem" : "3rem" }}>
          Students
        </Typography>
        <Search style={{ marginLeft: "auto", height: "2.5rem" }}>
          <SearchIconWrapper></SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </Search>
        <Button
          onClick={handleOpen}
          variant="contained"
          style={{ backgroundColor: "#22C55E", height: "2.5rem" }}
        >
          {isSmallScreen ? "ADD" : "ADD STUDENT"}
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ gap: "2px", alignItems: "center" }}
        >
          <Box sx={modalboxStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Student
            </Typography>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={updateStudent.name}
              onChange={(event) => onEditChange("name", event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={updateStudent.email}
              onChange={(event) => onEditChange("email", event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              value={updateStudent.phone}
              onChange={(event) => onEditChange("phone", event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Enroll Number"
              variant="outlined"
              value={updateStudent.enroll_number}
              onChange={(event) =>
                onEditChange("enroll_number", event.target.value)
              }
            />
            <TextField
              id="outlined-basic"
              label="Date of Admission"
              variant="outlined"
              value={updateStudent.date_of_admission}
              onChange={(event) =>
                onEditChange("date_of_admission", event.target.value)
              }
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#22C55E" }}
              onClick={onStudentAdd}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                setUpdateStudent(initialStudent);
                setOpen(false);
              }}
              variant="contained"
              style={{ backgroundColor: "#C55D22" }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </div>
      <div className="student-display">
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>name</StyledTableCell>
                <StyledTableCell align="center">email</StyledTableCell>
                {!isSmallScreen && (
                  <>
                    <StyledTableCell align="center">phone</StyledTableCell>
                    <StyledTableCell align="center">
                      ENROLL NUMBER
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      DATE OF ADMISSION
                    </StyledTableCell>
                  </>
                )}
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudentData.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  {!isSmallScreen && (
                    <>
                      <StyledTableCell align="center">
                        {row.phone}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.enroll_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(row.date_of_admission).toLocaleDateString()}
                      </StyledTableCell>
                    </>
                  )}
                  <StyledTableCell align="center">
                    <EditNoteIcon
                      style={{ color: "blue" }}
                      onClick={() => {
                        handleEditOpen(row);
                      }}
                    />
                    <DeleteOutlineIcon
                      onClick={() => {
                        handleDeleteOpen(row);
                      }}
                      style={{ color: "red" }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        open={openedit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ gap: "2px", alignItems: "center" }}
      >
        <Box sx={modalboxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Student
          </Typography>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={updateStudent.name}
            onChange={(event) => onEditChange("name", event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={updateStudent.email}
            onChange={(event) => onEditChange("email", event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Phone"
            variant="outlined"
            value={updateStudent.phone}
            onChange={(event) => onEditChange("phone", event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Enroll Number"
            variant="outlined"
            value={updateStudent.enroll_number}
            onChange={(event) =>
              onEditChange("enroll_number", event.target.value)
            }
          />
          <TextField
            id="outlined-basic"
            label="Date of Admission"
            variant="outlined"
            value={updateStudent.date_of_admission}
            onChange={(event) =>
              onEditChange("date_of_admission", event.target.value)
            }
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "#22C55E" }}
            onClick={onStudentEdit}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="success"
            style={{ backgroundColor: "#C55D22" }}
            onClick={() => {
              setUpdateStudent(initialStudent);
              setOpenEdit(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal
        open={opendelete}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ gap: "2px", alignItems: "center" }}
      >
        <Box sx={modalboxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure want to delete the student?
          </Typography>
          <div
            className="deleteIcon-buttons"
            style={{
              display: "flex",
              padding: "0px 50px",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "#22C55E" }}
              fullWidth
              onClick={onStudentDelete}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setUpdateStudent(initialStudent);
                setOpenDelete(false);
              }}
              style={{
                marginLeft: "auto",
                backgroundColor: "#C55D22",
              }}
              fullWidth
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Main;
