// ignore: no-unused-vars
type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};
export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    let message = 'Firestore error: Missing or insufficient permissions.';
    try {
      message =
        'FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n' +
        JSON.stringify(context, null, 2);
    } catch (e) { {/**/} }
    super(message);
    this.name = 'FirestorePermissionError';
  }
}
