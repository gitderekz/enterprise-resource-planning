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
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
  },
  total: {
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  }
});

const PayslipPDF = ({ record, user }) => {
  const currentDate = new Date().toLocaleDateString();
  const period = record.period.split('-');
  const monthName = new Date(2000, parseInt(period[1]) - 1).toLocaleString('default', { month: 'long' });
  const periodDisplay = `${monthName} ${period[0]}`;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>Your Company Name</Text>
          <Text style={styles.title}>PAYSLIP</Text>
          <Text style={styles.subtitle}>For {periodDisplay}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Employee Name:</Text>
            <Text>{user?.username || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Employee ID:</Text>
            <Text>{user?.id || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Position:</Text>
            <Text>{(user?.position??user?.role?.name) || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Pay Date:</Text>
            <Text>{currentDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          {record.details && (
            <>
              <View style={styles.row}>
                <Text>Base Salary:</Text>
                <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.details.baseSalary || 0).toFixed(2) || '0.00'}</Text>
              </View>
              {record.details.bonuses > 0 && (
                <View style={styles.row}>
                  <Text>Bonuses:</Text>
                  <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.details.bonuses || 0).toFixed(2)}</Text>
                </View>
              )}
              {record.details.allowances > 0 && (
                <View style={styles.row}>
                  <Text>Allowances:</Text>
                  <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.details.allowances || 0).toFixed(2)}</Text>
                </View>
              )}
              {record.details.overtime > 0 && (
                <View style={styles.row}>
                  <Text>Overtime:</Text>
                  <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.details.overtime || 0).toFixed(2)}</Text>
                </View>
              )}
            </>
          )}
          <View style={[styles.row, styles.total]}>
            <Text>Total Gross Pay:</Text>
            <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record?.grossSalary || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          {record.details?.deductionDetails?.length > 0 ? (
            <>
              {record.details.deductionDetails.map((d, i) => (
                <View key={i} style={styles.row}>
                  <Text>{d.description}:</Text>
                  <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(d.amount || 0).toFixed(2)}</Text>
                </View>
              ))}
              <View style={[styles.row, styles.total]}>
                <Text>Total Deductions:</Text>
                <Text>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.deductions || 0).toFixed(2)}</Text>
              </View>
            </>
          ) : (
            <Text>No deductions</Text>
          )}
        </View>

        <View style={[styles.section, styles.total]}>
          <View style={styles.row}>
            <Text style={styles.label}>Net Pay:</Text>
            <Text style={styles.label}>{`${process.env.NEXT_PUBLIC_CURRENCY}`}{Number(record.netSalary || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>This is an automatically generated payslip. Please contact HR for any discrepancies.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPDF;