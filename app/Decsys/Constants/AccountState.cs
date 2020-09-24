namespace Decsys.Constants
{
    // These are catch-all exclusive states a user account can be in
    // Their use from one context to another may differ
    // They're mirrored in the client-app codebase
    // using the numeric values!

    public enum AccountState
    {
        Unknown = 0,
        Valid = 1,
        RequiresEmailConfirmation = 2,
        RequiresApproval = 3,
        Rejected = 4,
    }
}
