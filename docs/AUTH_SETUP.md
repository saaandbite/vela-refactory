# Authentication Setup

## Overview
This Backstage instance supports multiple authentication methods:
- **Guest Authentication**: For development and testing
- **GitHub OAuth**: For production use

## Configuration

### Guest Authentication
Guest authentication is enabled by default in development mode. Users can sign in as "guest" without any credentials.

### GitHub OAuth
GitHub OAuth requires:
1. GitHub OAuth App credentials (Client ID and Secret)
2. User entities in the catalog that match GitHub usernames or emails

## Sign-In Resolvers

The system uses multiple resolvers in order of priority:

1. **usernameMatchingUserEntityName**: Matches GitHub username to User entity name
2. **emailMatchingUserEntityProfileEmail**: Matches GitHub email to User entity profile email
3. **emailLocalPartMatchingUserEntityName**: Matches email local part (before @) to User entity name

## Adding New Users

To add a new user to the catalog, edit `examples/org.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: github-username  # Must match GitHub username
spec:
  profile:
    displayName: Full Name
    email: user@example.com  # Should match GitHub email
  memberOf: [guests, developers]
```

## Troubleshooting

### "Failed to sign-in, unable to resolve user identity"

This error occurs when:
1. No User entity exists in the catalog matching your GitHub username/email
2. The catalog hasn't loaded the User entities yet

**Solutions:**
1. Add your User entity to `examples/org.yaml`
2. Restart the backend to reload the catalog
3. Use Guest authentication as a fallback

### Checking Catalog Entities

Visit `/catalog?filters[kind]=user` to see all User entities in the catalog.

## Security Notes

- Guest authentication should be disabled in production
- GitHub OAuth credentials should be stored in environment variables
- User entities should be managed through a proper identity provider in production
