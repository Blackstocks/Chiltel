import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FileDown } from "lucide-react";

const RiderAttendance = ({ riderId, riderName, phoneNumber }) => {
  const [date, setDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Example attendance data - In a real application, fetch this based on riderId
  const attendanceData = {
    totalDays: 26,
    presentDays: 22,
    absentDays: 4,
    halfDays: 0,
    attendance: [
      { date: "2024-01-17", status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM" },
      { date: "2024-01-16", status: "present", checkIn: "09:15 AM", checkOut: "06:30 PM" },
      { date: "2024-01-15", status: "absent", checkIn: null, checkOut: null },
    ]
  };

  const getStatusColor = (status) => {
    const colors = {
      "present": "bg-green-100 text-green-800",
      "absent": "bg-red-100 text-red-800",
      "half-day": "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-medium">{riderName}</div>
          <div className="text-sm text-gray-500">{phoneNumber}</div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4 flex gap-2 flex-wrap">
              <Badge className="bg-green-100 text-green-800">
                {attendanceData.presentDays} Present
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                {attendanceData.absentDays} Absent
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800">
                {attendanceData.halfDays} Half Day
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Daily Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Working Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>{record.checkOut || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.checkIn && record.checkOut ? "9 hours" : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Monthly Overview</CardTitle>
              <div className="flex gap-2">
                <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {attendanceData.totalDays}
                  </div>
                  <div className="text-sm text-gray-500">Total Working Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {attendanceData.presentDays}
                  </div>
                  <div className="text-sm text-gray-500">Present Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {attendanceData.absentDays}
                  </div>
                  <div className="text-sm text-gray-500">Absent Days</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {((attendanceData.presentDays / attendanceData.totalDays) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Attendance Percentage</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiderAttendance;