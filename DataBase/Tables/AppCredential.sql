CREATE TABLE [dbo].[AppCredential]
(
  [ClientId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
  [ClientSecret] VARCHAR(64) NOT NULL,
  [CreatedAt] DATETIME NOT NULL,
  [UpdatedAt] DATETIME NOT NULL,
  [IsActive] BIT NOT NULL,
  [CreatedBy] UNIQUEIDENTIFIER NOT NULL,
  [UpdatedBy] UNIQUEIDENTIFIER NOT NULL,
  CONSTRAINT [FK_AppCredentials_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[User]([UserId]),
  CONSTRAINT [FK_AppCredentials_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User]([UserId]),
  CONSTRAINT [FK_AppCredentials_UpdatedBy] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[User]([UserId])
)
