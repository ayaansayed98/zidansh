# TODO: Fix CustomerManager.tsx Errors

- [ ] Import customerService and bulkOrderService from '../lib/database'
- [ ] Add state variables: customers (Customer[]), bulkOrders (BulkOrder[]), loading (boolean)
- [ ] Add useEffect to load data on component mount and when refreshTrigger changes
- [ ] Define loadData async function to fetch customers and bulk orders, handle loading state
- [ ] Update JSX to use customers.length, bulkOrders.length, loading state, and pass loadData to CustomerList
