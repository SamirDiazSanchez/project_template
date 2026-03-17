CREATE PROCEDURE [dbo].[spRemove_AppCredential]
  @ClientId UNIQUEIDENTIFIER = NULL,
  @RecordBy UNIQUEIDENTIFIER = NULL,
  @StatusCode INT OUTPUT,
  @StatusMessage VARCHAR(1000) OUTPUT
AS
BEGIN
  DECLARE @CurrentDate DATETIME = GETUTCDATE();

  IF @ClientId IS NULL
  OR @RecordBy IS NULL
  BEGIN
    SET @StatusCode = 1;
    SET @StatusMessage = 'Parameter is required';
    RETURN;
  END

  IF NOT EXISTS (SELECT 1 FROM [dbo].[AppCredential] WHERE [ClientId] = @ClientId)
  BEGIN
    SET @StatusCode = 2;
    SET @StatusMessage = 'Application not found';
    RETURN;
  END

  BEGIN TRY
    BEGIN TRANSACTION

    UPDATE [dbo].[AppCredential]
      SET
        [IsActive] = 0,
        [UpdatedBy] = @RecordBy,
        [UpdatedAt] = @CurrentDate
      WHERE [ClientId] = @ClientId;

      SET @StatusCode = 0;
      SET @StatusMessage = 'Application removed successfully';
      COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE();
    ROLLBACK TRANSACTION;
  END CATCH
END
