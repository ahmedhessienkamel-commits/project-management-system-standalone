import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL, connectTimeout: 8000, enableKeepAlive: false });
try {
  await connection.beginTransaction();
  const cards = [
    ['NIMAR-LAND', 'تكلفة شراء الأرض', 'land_acquisition'],
    ['NIMAR-CONSTRUCTION', 'تكاليف المباني والإنشاءات', 'construction'],
    ['NIMAR-PAYROLL', 'الرواتب وأجور العاملين', 'payroll'],
    ['NIMAR-CONSULTING', 'مصاريف الاستشارات', 'consulting'],
    ['NIMAR-DESIGN', 'مصاريف التصميم', 'design'],
    ['NIMAR-LEGAL-ACCOUNTING', 'مصاريف المحاسب القانوني', 'legal_accounting'],
    ['NIMAR-SALES-COMMISSION', 'عمولات البيع', 'sales_commission'],
    ['NIMAR-CONTINGENCY', 'مصاريف أخرى واحتياطي', 'contingency'],
    ['NIMAR-INSURANCE', 'التأمين على العملية العقارية', 'insurance'],
    ['NIMAR-MARKETING', 'تكاليف التسويق', 'marketing'],
    ['NIMAR-SALES-REVENUE', 'مبيعات الوحدات المخططة', 'revenue'],
    ['NIMAR-ZAKAT', 'الزكاة المخططة', 'zakat'],
  ];
  for (const [code, name, category] of cards) {
    await connection.execute('INSERT IGNORE INTO costItems (projectId, parentId, code, name, category, accountId, isActive, createdBy) VALUES (1, NULL, ?, ?, ?, NULL, 1, 1)', [code, name, category]);
  }
  await connection.execute(`INSERT INTO projectBudgets (companyId, projectId, budgetCode, name, currency, status, plannedRevenue, plannedCost, plannedTax, plannedZakat, plannedProfit, notes, createdBy)
    VALUES (1, 1, 'NIMAR-2026', 'موازنة مشروع نمار 2026', 'SAR', 'approved', 15708739.00, 13166268.00, 0.00, 63562.00, 2478909.00, 'موازنة مخططة مستوردة من ملف المستخدم. لا تمثل حركات فعلية.', 1)
    ON DUPLICATE KEY UPDATE name=VALUES(name), plannedRevenue=VALUES(plannedRevenue), plannedCost=VALUES(plannedCost), plannedTax=VALUES(plannedTax), plannedZakat=VALUES(plannedZakat), plannedProfit=VALUES(plannedProfit), notes=VALUES(notes), status='approved'`);
  const [[budget]] = await connection.query("SELECT id FROM projectBudgets WHERE budgetCode='NIMAR-2026' LIMIT 1");
  await connection.execute('DELETE FROM projectBudgetLines WHERE budgetId=?', [budget.id]);
  const lines = [
    ['revenue', 'REV-001', 'مبيعات الوحدات المخططة', 15708739, 'NIMAR-SALES-REVENUE', 'not_applicable', 1],
    ['cost', 'CST-001', 'تكلفة شراء الأرض', 3000000, 'NIMAR-LAND', 'pre_tax', 2],
    ['cost', 'CST-002', 'تكاليف المباني والإنشاءات', 7761780, 'NIMAR-CONSTRUCTION', 'pre_tax', 3],
    ['cost', 'CST-003', 'الرواتب وأجور العاملين', 1000000, 'NIMAR-PAYROLL', 'pre_tax', 4],
    ['cost', 'CST-004', 'مصاريف الاستشارات', 290150, 'NIMAR-CONSULTING', 'pre_tax', 5],
    ['cost', 'CST-005', 'مصاريف التصميم', 80000, 'NIMAR-DESIGN', 'pre_tax', 6],
    ['cost', 'CST-006', 'مصاريف المحاسب القانوني', 69000, 'NIMAR-LEGAL-ACCOUNTING', 'pre_tax', 7],
    ['cost', 'CST-007', 'عمولات البيع 2.5%', 392718, 'NIMAR-SALES-COMMISSION', 'pre_tax', 8],
    ['cost', 'CST-008', 'مصاريف أخرى واحتياطي', 217620, 'NIMAR-CONTINGENCY', 'pre_tax', 9],
    ['cost', 'CST-009', 'التأمين على العملية العقارية', 105000, 'NIMAR-INSURANCE', 'pre_tax', 10],
    ['cost', 'CST-010', 'تكاليف التسويق', 250000, 'NIMAR-MARKETING', 'pre_tax', 11],
    ['zakat', 'TAX-001', 'الزكاة', 63562, 'NIMAR-ZAKAT', 'not_applicable', 12],
  ];
  for (const [lineType, code, name, amount, cardCode, taxBasis, sortOrder] of lines) {
    const [[card]] = await connection.query('SELECT id FROM costItems WHERE code=? LIMIT 1', [cardCode]);
    await connection.execute('INSERT INTO projectBudgetLines (budgetId, projectId, costItemId, lineType, code, name, amount, taxBasis, source, sortOrder, createdBy) VALUES (?, 1, ?, ?, ?, ?, ?, ?, \'user_import\', ?, 1)', [budget.id, card.id, lineType, code, name, amount, taxBasis, sortOrder]);
  }
  await connection.execute("INSERT INTO projectBudgetLines (budgetId, projectId, lineType, code, name, amount, taxBasis, source, sortOrder, notes, createdBy) VALUES (?, 1, 'profit', 'PROFIT-001', 'صافي الربح المخطط بعد الزكاة', 2478909.00, 'not_applicable', 'calculated', 13, 'الإيراد ناقص التكاليف والزكاة', 1)", [budget.id]);
  await connection.commit();
  const [[summary]] = await connection.query('SELECT COUNT(*) AS lineCount, SUM(CASE WHEN lineType=\'cost\' THEN amount ELSE 0 END) AS costLines, SUM(CASE WHEN lineType=\'revenue\' THEN amount ELSE 0 END) AS revenueLines FROM projectBudgetLines WHERE budgetId=?', [budget.id]);
  console.log(JSON.stringify({ budgetId: budget.id, ...summary }));
} catch (error) {
  await connection.rollback();
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
