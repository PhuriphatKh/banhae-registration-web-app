import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  updateDoc, // <- เพิ่ม
  doc, // <- เพิ่ม
} from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { db } from "../firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";

function RequestPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const auth = getAuth();
  const { user } = useUserAuth();
  const { profileData } = useUserProfile();
  const { firstName, lastName } = useUserAuth();
  const requesterUid = auth.currentUser?.uid ?? null;
  const requesterName = `${firstName} ${lastName}` || "ไม่ระบุ";

  const [subjects, setSubjects] = useState([]);
  const [taughtSubject, setTaughtSubject] = useState([]);
  const [approvalRequests, setApprovalRequests] = useState([]);

  // modal state + form
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjectID, setSubjectID] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  // confirm cancel state
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Get the subjects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(data);
      console.log("Subjects data updated:", data);
    });

    return () => unsubscribe(); // ยกเลิกเมื่อ component unmount
  }, []);

  // Get the subjects taught by the teacher
  useEffect(() => {
    if (!profileData) return;

    const loadTeacher = profileData.find((item) => item.id === user.uid);
    if (loadTeacher) {
      setTaughtSubject(loadTeacher.user.taughtSubject);
    }
  }, [profileData]);

  // subscribe approval requests
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "approval_requests"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // sort newest first
      items.sort((a, b) => {
        const ta =
          a.createdAt && typeof a.createdAt.toDate === "function"
            ? a.createdAt.toDate().getTime()
            : a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;
        const tb =
          b.createdAt && typeof b.createdAt.toDate === "function"
            ? b.createdAt.toDate().getTime()
            : b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;
        return tb - ta;
      });
      setApprovalRequests(items);
    });
    return () => unsub();
  }, []);

  const openModal = () => {
    setShowModal(true);
    setSuccessMsg("");
    setErrorMsg("");
  };
  const closeModal = () => setShowModal(false);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const subjectData = subjects.find((subj) => subj.id === subjectID);
    if (!subjectData) {
      setErrorMsg("กรุณาเลือกวิชาที่ถูกต้อง");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "approval_requests"), {
        type: "score_update",
        school_record_path: `school_record/2567/${subjectData.classLevel}/${subjectID}`,
        subjectID: subjectID,
        classLevel: subjectData.classLevel,
        requesterUid,
        requesterName,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccessMsg("ส่งคำขอเรียบร้อยแล้ว");
      // clear form
      setSubjectID("");
      setNote("");
      // close after short delay
      setTimeout(() => {
        setLoading(false);
        closeModal();
      }, 900);
    } catch (err) {
      console.error("Error creating approval request:", err);
      setErrorMsg("เกิดข้อผิดพลาดในการส่งคำขอ");
      setLoading(false);
    }
  };

  // แสดง modal ยืนยันการยกเลิก
  const handleCancelRequest = (requestId) => {
    if (!requestId) return;
    setConfirmCancelId(requestId);
    setShowConfirmCancel(true);
  };

  // เมื่อยืนยัน ให้ทำการยกเลิกจริง ๆ
  const performCancelRequest = async () => {
    if (!confirmCancelId) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await updateDoc(doc(db, "approval_requests", confirmCancelId), {
        status: "canceled",
        canceledAt: serverTimestamp(),
      });
      setSuccessMsg("ยกเลิกคำขอเรียบร้อยแล้ว");
      setShowConfirmCancel(false);
      setConfirmCancelId(null);
    } catch (err) {
      console.error("Error canceling approval request:", err);
      setErrorMsg("เกิดข้อผิดพลาดในการยกเลิกคำขอ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#d9d9d9" }}>
      <Navbar />
      <div className="page-detail p-3">
        <div className="request-page p-3">
          {type === "submit" ? (
            <>
              <h1>ยื่นคำขออนุมัติ</h1>
              <hr />
              <table className="request-table text-center">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>รายละเอียด</th>
                    <th>ตัวเลือก</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>คำขออนุมัติคะแนนรายวิชา</td>
                    <td>
                      <button
                        type="button"
                        className="save-butt"
                        onClick={openModal}
                      >
                        ยื่นคำขออนุมัติ
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : type === "check" ? (
            <>
              <h1>ตรวจสอบคำขอ</h1>
              <hr />
              <table className="request-table text-center">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th colSpan={2}>รายละเอียด</th>
                    <th>สถานะ</th>
                    <th>ตัวเลือก</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalRequests.length === 0 ? (
                    <tr>
                      <td colSpan="3">ไม่มีคำขออนุมัติ</td>
                    </tr>
                  ) : (
                    approvalRequests
                      .filter(
                        (request) => request.requesterUid === requesterUid
                      )
                      .map((request, index) => (
                        <tr key={request.id}>
                          <td>{index + 1}</td>
                          <td className="text-start">
                            หัวข้อ: {request.type} <br />
                            วิชา: {request.subjectID} <br />
                            ระดับชั้น: {request.classLevel} <br />
                            ผู้ขอ: {request.requesterName} <br />
                            วันที่ส่ง:{" "}
                            {request.createdAt && request.createdAt.toDate
                              ? request.createdAt.toDate().toLocaleString()
                              : request.createdAt
                              ? new Date(request.createdAt).toLocaleString()
                              : "ไม่ระบุ"}
                            <br />
                            หมายเหตุ: {request.note || "-"}
                          </td>
                          <td className="text-start">
                            {request.status === "approved" && (
                              <span style={{ color: "green" }}>
                                ผู้อนุมัติ: {request.approverName || "-"} <br />
                                อนุมัติเมื่อ:{" "}
                                {request.approvedAt && request.approvedAt.toDate
                                  ? request.approvedAt.toDate().toLocaleString()
                                  : request.approvedAt
                                  ? new Date(
                                      request.approvedAt
                                    ).toLocaleString()
                                  : "ไม่ระบุ"}
                              </span>
                            )}
                          </td>
                          <td>
                            {request.status === "approved" && (
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                อนุมัติแล้ว
                              </span>
                            )}
                            {request.status === "pending" && (
                              <span
                                style={{ color: "orange", fontWeight: "bold" }}
                              >
                                รอการอนุมัติ
                              </span>
                            )}
                          </td>
                          {request.status === "pending" && (
                            <td>
                              <button
                                className="cancel-butt"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                ยกเลิกคำขอ
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <h1>คำร้องไม่ถูกต้อง</h1>
          )}
        </div>
      </div>

      {/* Modal for submitting request */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={handleSubmitRequest}>
          <Modal.Header closeButton>
            <Modal.Title>ยื่นคำขออนุมัติคะแนนรายวิชา</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form.Group className="mb-2">
              <Form.Label>ขื่อวิชา</Form.Label>
              <Form.Control
                as="select"
                value={subjectID}
                onChange={(e) => setSubjectID(e.target.value)}
              >
                <option value="" disabled>
                  -- เลือกวิชา --
                </option>
                {subjects
                  .filter((subject) => taughtSubject.includes(subject.id))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.id} - {subject.name} ({subject.classLevel})
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>รายละเอียด / หมายเหตุ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="อธิบายเหตุผลหรือรายละเอียดเพิ่มเติม"
              />
            </Form.Group>

            <div className="mt-2">
              <small>ผู้ขอ: {requesterName}</small>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cancel-butt"
              onClick={closeModal}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button className="save-butt" type="submit" disabled={loading}>
              {loading ? "กำลังส่ง..." : "ส่งคำขอ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal for confirming cancel request */}
      <Modal
        show={showConfirmCancel}
        onHide={() => setShowConfirmCancel(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการยกเลิกคำขอ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำขอนี้?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="cancel-butt"
            onClick={() => setShowConfirmCancel(false)}
          >
            ยกเลิก
          </Button>
          <Button
            className="save-butt"
            onClick={performCancelRequest}
            disabled={loading}
          >
            {loading ? "กำลังยกเลิก..." : "ยืนยันการยกเลิก"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default RequestPage;
