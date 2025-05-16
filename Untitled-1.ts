// {`${process.env.NEXT_PUBLIC_CURRENCY}`}
// - If  employee's number of Absent is 4, these should be a button to send a notification

/*







- synchronizing
inputs
buy data

time started captute = 
price = 
































**************************************************
const getPayrollSummary = async (req, res) => {
  try {
    const { period } = req.query; // daily, monthly, annual
    
    let attributes, groupBy, orderBy;

    if (period === 'daily') {
      attributes = [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross']
      ];
      groupBy = [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))];
      orderBy = [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']];
    } else if (period === 'monthly') {
      const monthFormat = '%Y-%m'; // Define the month format
      attributes = [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
        [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
        [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
      ];
      groupBy = [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat)];
      orderBy = [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat), 'ASC']];
    } else {
      attributes = [
        [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
        [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
        [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
        [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
      ];
      groupBy = [db.sequelize.fn('YEAR', db.sequelize.col('createdAt'))];
      orderBy = [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC']];
    }

    const summary = await db.payroll.findAll({
      attributes,
      group: groupBy,
      order: orderBy
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payroll summary', error: err.message });
  }
};

**********************************************************************************
export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth); // Correct placement

  // Check if current route is auth route
  const authRoutes = ['/login', '/register', '/forgot-password']; // Expandable
  // const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));  
  // const isAuthRoute = authRoutes.includes(pathname); // Use `includes`, not `startsWith`
  const isAuthRoute = pathname === '/login';
  console.log('Current Pathname:', pathname === '/login');
  


onerror, useEffect

C:\dev\web\enterpris…ocketContext.js:128 WebSocket error: Unknown error

C:\dev\web\enterpris…ocketContext.js:129 Uncaught InvalidAccessError: Failed to execute 'close' on 'WebSocket': The close code must be either 1000, or between 3000 and 4999. 1011 is neither.
    at WebSocketProvider.useCallback[connectWebSocket] (C:\dev\web\enterpris…etContext.js:129:10)




// user
// -ext center
// =
// =cpp1tu
************************************************
psyop
vegetative state
geo fence
muffle
************************************************
SEQUELIZE
// Install locally (recommended)
npm install --save-dev sequelize-cli
npm install --save-dev sequelize-cli
// Install globally (if you prefer)
npm install -g sequelize-cli

station-location-parent=>parent==null
station.location

npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

npx sequelize-cli db:seed --seed payroll-seeder.js
npx sequelize-cli db:seed:undo --seed payroll-seeder.js

/** */
static getGrowerDetails(context,subzone_id,farmerId,registrationNumber,totalValue) {
  // totalValue = 32544;
    // await SynchronizationServices.pullGrowers(subzone_id,'subzone_name');
    var jsonString;
    var growersSuggestionsList = [];
    var growersDataMap = [];

    jsonString = sharedPreferences.get('growers,$subzone_id');
    if(jsonString == null){
      return [0,0,0];
    }
    // Parse the JSON string
    Map<String, dynamic> map = jsonDecode(jsonString);
    // Initialize an empty map
    Map<int, String> dataMap = {};
    // Extract data from the 'data' list and build the map
    List<dynamic> dataList = map['growers'];
    var farmer = dataList.where((element) =>  element['id'] == int.parse(farmerId));
    var id = dataList.indexWhere((element) =>  element['id'] == int.parse(farmerId));
    // print('LIST => ${dataList[id]}');

    print('Found => ${farmer.first}');
    print('LOAN => ${farmer.first['loans']}');
    // NEW
    int? deducted_loan = 0;
    int loanAmount=0;
    var difference=0;
    // NEW

    if(farmer.first != null){
      // kamakuna loan
      if(farmer.first['loans'] != null && farmer.first['loans'].isNotEmpty){

        // loop loan
        for(var i =0;i<farmer.first['loans'].length;i++){
          // TODO remove below if condition when cash loan is to be deducted
          // if(!farmer.first['loans'][i]['package']['isCash']){
            // for(var x =0;x<farmer.first['loans'][i]['transactions'].length;x++){
            //   loanAmount +=  (farmer.first['loans'][i]['transactions'][x]['credited']? /*double.parse*/((farmer.first['loans'][i]['transactions'][x]['amount']).toInt()) : (-1*/*double.parse*/((farmer.first['loans'][i]['transactions'][x]['amount']).toInt()))) as int;
            // }
            if (farmer.first['loans'][i]['inputs'].isNotEmpty) {
              for(var x =0;x<farmer.first['loans'][i]['inputs'].length;x++){
                loanAmount +=  (farmer.first['loans'][i]['inputs'][x]['value']? ((farmer.first['loans'][i]['inputs'][x]['value']).toInt()) : 0 ) as int;
              }
            }
          // }
        }
        print('LOAN_AMOUNT: ${loanAmount}');
        difference = totalValue.toInt() - loanAmount;
        // var payment = ( difference>0?difference: difference==0?(totalValue*0.2): (totalValue*0.5) ).toInt();
        // var deductedAmount = ( difference>0?loanAmount: difference==0?(totalValue*0.8): (totalValue*0.5) ).toInt();
        var payment = ( difference>0?difference: difference==0?(0): (0) ).toInt();
        var deductedAmount = ( difference>0?loanAmount: difference==0?(totalValue): (totalValue) ).toInt();
        var updated_loans =  loanAmount - deductedAmount;


        var update = jsonDecode(jsonString);
        // var diff = ( difference>0?totalValue: difference==0?(totalValue*0.8): (totalValue*0.5) ).toInt();
        var diff = ( difference>0?totalValue: difference==0?(totalValue): (totalValue) ).toInt();
        for(var i =0;i<farmer.first['loans'].length;i++){
          // TODO remove below if condition when cash loan is to be deducted
          // if(!farmer.first['loans'][i]['package']['isCash']){
            for(var x =0;x<farmer.first['loans'][i]['inputs'].length;x++){
              int currentAmount =  (farmer.first['loans'][i]['inputs'][x]['value']).toInt() ;
              if (diff >= 0) {
                diff -= currentAmount;
                // farmer.first['loans'][i]['transactions'][x]['amount'] = ( diff>=0?0:(-1*(diff)) );
                print('DIFF: ${diff}');
                update['growers'][id]['loans'][i]['inputs'][x]['value'] = ( diff>=0?0:(-1*(diff)) ).toInt();
                // update['growers'][id]['loans'][i]['inputs'][x]['value'] = ( updated_loans ).toInt();
                sharedPreferences.setString('growers,$subzone_id',json.encode(update));
                // diff<0?diff=0:'';
              }
            }
          // }
        }

        bool updated_loans_farmers_ids = sharedPreferences.containsKey('updated_loans_farmers_ids');
        var ids = '';
        var idLists = [];
        if(updated_loans_farmers_ids){
          ids = sharedPreferences.get('updated_loans_farmers_ids').toString();
          idLists = sharedPreferences.get('updated_loans_farmers_ids').toString().split(',');
        }
        if(idLists.contains((farmer.first['id']).toString())){
          sharedPreferences.setString('updated_loans,${farmer.first['id']}', updated_loans.toString() );

          deducted_loan = int.tryParse(sharedPreferences.getString('deducted_loans,${farmer.first['id']}').toString());
          deducted_loan = deducted_loan!=null?(deducted_loan + deductedAmount):deductedAmount;
          sharedPreferences.setString('deducted_loans,${farmer.first['id']}', ( deducted_loan).toString() );
          sharedPreferences.setString('time_stamp,${farmer.first['id']}', ( CrHelperFunctions.dateFormat(DateTime.now().toString()) ).toString() );
        }else{
          sharedPreferences.setString('updated_loans_farmers_ids', '${ids}${farmer.first['id']},' );
          sharedPreferences.setString('updated_loans,${farmer.first['id']}', updated_loans.toString() );

          deducted_loan = deductedAmount;
          sharedPreferences.setString('deducted_loans,${farmer.first['id']}', ( deducted_loan).toString() );
          sharedPreferences.setString('time_stamp,${farmer.first['id']}', ( CrHelperFunctions.dateFormat(DateTime.now().toString()) ).toString() );
        }
        // ##########################################################################
        // sharedPreferences.remove('updated_loans_farmers_ids');
        // sharedPreferences.remove('updated_loans,${farmer.first['id']}');
        // sharedPreferences.remove('deducted_loans,${farmer.first['id']}');
        // update['growers'][id]['loans'][0]['transactions'][0]['amount'] = 248955;
        // sharedPreferences.setString('growers,$subzone_id',json.encode(update));
        // ##########################################################################
        print('UPDATED FARMERS ${sharedPreferences.get('updated_loans_farmers_ids')}');
        print('UPDATED LOANS ${sharedPreferences.get('updated_loans,${farmer.first['id']}')}');
        // **********************************END UPDATE LOAN**********************************************************
        // return [(loanAmount).toInt(), (update['growers'][id]['loans'][0]['transactions'][0]['amount']).toInt(), payment];
        return [(loanAmount).toInt(), (updated_loans).toInt(), payment];
        // NEW

        // **********************
        if(farmer.first['loans'][0] != null){
          if(farmer.first['loans'][0]['transactions'] != null && farmer.first['loans'][0]['transactions'].isNotEmpty){
            if(farmer.first['loans'][0]['transactions'][0] != null){
              if(farmer.first['loans'][0]['transactions'][0]['amount'] != null){
                // *************************************UPDATE LOAN***********************************************************
                int? deducted_loan = 0;
                var loanAmount = farmer.first['loans'][0]['transactions'][0]['amount'];
                var difference = totalValue - farmer.first['loans'][0]['transactions'][0]['amount'];
                var update = jsonDecode(jsonString);

                var payment = ( difference>0?difference: difference==0?(totalValue*0.2): (totalValue*0.5) ).toInt();
                var updated_loans = ( difference>0?0:difference==0?(-1*(totalValue*0.8 - farmer.first['loans'][0]['transactions'][0]['amount'])):(-1*(totalValue*0.5 - farmer.first['loans'][0]['transactions'][0]['amount'])) );
                var deductedAmount = ( difference>0?loanAmount: difference==0?(totalValue*0.8): (totalValue*0.5) ).toInt();

                update['growers'][id]['loans'][0]['transactions'][0]['amount'] = updated_loans.toInt();
                sharedPreferences.setString('growers,$subzone_id',json.encode(update));

                bool updated_loans_farmers_ids = sharedPreferences.containsKey('updated_loans_farmers_ids');
                var ids = '';
                var idLists = [];
                if(updated_loans_farmers_ids){
                  ids = sharedPreferences.get('updated_loans_farmers_ids').toString();
                  idLists = sharedPreferences.get('updated_loans_farmers_ids').toString().split(',');
                }
                if(idLists.contains((farmer.first['id']).toString())){
                  sharedPreferences.setString('updated_loans,${farmer.first['id']}', updated_loans.toString() );

                  deducted_loan = int.tryParse(sharedPreferences.getString('deducted_loans,${farmer.first['id']}').toString());
                  deducted_loan = deducted_loan!=null?(deducted_loan + deductedAmount):deductedAmount;
                  sharedPreferences.setString('deducted_loans,${farmer.first['id']}', ( deducted_loan).toString() );
                }else{
                  sharedPreferences.setString('updated_loans_farmers_ids', '${ids}${farmer.first['id']},' );
                  sharedPreferences.setString('updated_loans,${farmer.first['id']}', updated_loans.toString() );

                  deducted_loan = deductedAmount;
                  sharedPreferences.setString('deducted_loans,${farmer.first['id']}', ( deducted_loan).toString() );
                }
                // ##########################################################################
                // sharedPreferences.remove('updated_loans_farmers_ids');
                // sharedPreferences.remove('updated_loans,${farmer.first['id']}');
                // update['growers'][id]['loans'][0]['transactions'][0]['amount'] = 248955;
                // sharedPreferences.setString('growers,$subzone_id',json.encode(update));
                // ##########################################################################
                print('UPDATED FARMERS ${sharedPreferences.get('updated_loans_farmers_ids')}');
                print('UPDATED LOANS ${sharedPreferences.get('updated_loans,${farmer.first['id']}')}');
                // **********************************END UPDATE LOAN**********************************************************
                return [(loanAmount).toInt(), (update['growers'][id]['loans'][0]['transactions'][0]['amount']).toInt(), payment];
              }
            }
          }
        }
        // *********************
      }
    }
    return [0,0,totalValue];
  }
