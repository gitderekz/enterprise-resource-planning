import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  }
});

const PayrollPDF = ({ records, reportType }) => {
  const currentDate = new Date().toLocaleDateString();
  const totalGross = records.reduce((sum, record) => sum + Number(record.grossSalary || 0), 0);
  const totalDeductions = records.reduce((sum, record) => sum + Number(record.deductions || 0), 0);
  const totalNet = records.reduce((sum, record) => sum + Number(record.netSalary || 0), 0);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Payroll Report</Text>
          <Text style={styles.subtitle}>
            {reportType === 'monthly' ? 'Monthly' : reportType === 'annual' ? 'Annual' : 'Daily'} Report
          </Text>
          <Text>Generated on: {currentDate}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Employee</Text>
            <Text style={styles.tableCell}>Position</Text>
            <Text style={styles.tableCell}>Period</Text>
            <Text style={styles.tableCell}>Gross Salary</Text>
            <Text style={styles.tableCell}>Deductions</Text>
            <Text style={styles.tableCell}>Net Salary</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>

          {/* Table Rows */}
          {records.map((record, index) => (
            console.log("record",record),
            
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{record.user?.username || 'N/A'}</Text>
              <Text style={styles.tableCell}>{(record.user?.position??record.user?.role?.name) || 'N/A'}</Text>
              <Text style={styles.tableCell}>{record.period}</Text>
              <Text style={styles.tableCell}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.grossSalary || 0).toFixed(2)}</Text>
              <Text style={styles.tableCell}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.deductions || 0).toFixed(2)}</Text>
              <Text style={styles.tableCell}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.netSalary || 0).toFixed(2)}</Text>
              <Text style={styles.tableCell}>{record.status}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Gross Salary:</Text>
            <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(totalGross||0).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Deductions:</Text>
            <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(totalDeductions||0).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.total]}>
            <Text>Total Net Salary:</Text>
            <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(totalNet||0).toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PayrollPDF;