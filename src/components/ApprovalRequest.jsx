import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Modal, Button } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ApprovalRequest() {
  const [approvalRequests, setApprovalRequests] = useState([]);

  // modal สำหรับยืนยันการอนุมัติ
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const requesterUid = user ? user.uid : null;

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

  // เปิด modal แสดงรายละเอียดคำร้องก่อนยืนยัน
  const openConfirmModal = (request) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  // เมื่อกดยืนยันใน modal ทำการอนุมัติจริง
  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    setLoadingApprove(true);
    try {
      const approverName = user?.displayName ?? "ไม่ระบุ";
      await updateDoc(doc(db, "approval_requests", selectedRequest.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
        approverName,
      });
      setShowConfirmModal(false);
      setSelectedRequest(null);
      console.log("Approval request approved.");
    } catch (err) {
      console.error("Error approving request:", err);
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-detail p-3">
        <div className="request-page p-3">
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
                approvalRequests.map((request, index) => (
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
                            ? new Date(request.approvedAt).toLocaleString()
                            : "ไม่ระบุ"}
                        </span>
                      )}
                    </td>
                    <td>
                      {request.status === "approved" && (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          อนุมัติแล้ว
                        </span>
                      )}
                      {request.status === "pending" && (
                        <span style={{ color: "orange", fontWeight: "bold" }}>
                          รอการอนุมัติ
                        </span>
                      )}
                    </td>
                    {request.status === "pending" && (
                      <td>
                        <button
                          className="save-butt"
                          onClick={() => openConfirmModal(request)}
                        >
                          อนุมัติ
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ยืนยันการอนุมัติ */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการอนุมัติคำขอ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <p>
                <h5>คุณแน่ใจหรือไม่ว่าต้องการอนุมัติคำขอนี้?</h5>
                หัวข้อ:{" "}{selectedRequest.type} <br />
                วิชา: {selectedRequest.subjectID} <br />
                ระดับชั้น: {selectedRequest.classLevel} <br />
                ผู้ขอ: {selectedRequest.requesterName} <br />
                วันที่ส่ง:{" "}
                {selectedRequest.createdAt && selectedRequest.createdAt.toDate
                  ? selectedRequest.createdAt.toDate().toLocaleString()
                  : selectedRequest.createdAt
                  ? new Date(selectedRequest.createdAt).toLocaleString()
                  : "ไม่ระบุ"}
                <br />
                หมายเหตุ: {selectedRequest.note || "-"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="cancel-butt"
            onClick={() => setShowConfirmModal(false)}
          >
            ยกเลิก
          </Button>
          <Button
            className="save-butt"
            onClick={handleApproveRequest}
            disabled={loadingApprove}
          >
            {loadingApprove ? "กำลังอนุมัติ..." : "ยืนยันอนุมัติ"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default ApprovalRequest;
