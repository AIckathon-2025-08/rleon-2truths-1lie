# Testing Patterns for Two Truths & A Lie Game

This guide provides testing patterns for React components, Node.js backend, and Socket.io real-time communication using Jest, React Testing Library, and behavioral testing approaches.

## Core Testing Philosophy

### Game-Focused Testing
- Test voting workflows and game state transitions
- Focus on user interactions: voting, viewing results, admin actions
- Test real-time updates and Socket.io event handling
- Validate Test IO brand styling and accessibility

### Test Categories
- **Component Tests**: React voting interface and admin panel testing
- **Socket Tests**: Real-time communication and game state synchronization  
- **Integration Tests**: Complete voting workflows from admin setup to results
- **Visual Tests**: Test IO brand compliance and responsive design

## Unit Testing Patterns

### Vote Calculation Testing
```typescript
// Test vote percentage calculations
import { calculateVotePercentages, validateVoteData } from '../utils/voting';

describe('Vote Calculations', () => {
  test('calculates vote percentages correctly', () => {
    const votes = { 0: 10, 1: 20, 2: 5 }; // 35 total votes
    const percentages = calculateVotePercentages(votes);
    
    expect(percentages[0]).toBeCloseTo(28.57, 2); // 10/35 = 28.57%
    expect(percentages[1]).toBeCloseTo(57.14, 2); // 20/35 = 57.14%
    expect(percentages[2]).toBeCloseTo(14.29, 2); // 5/35 = 14.29%
  });

  test('handles zero votes gracefully', () => {
    const votes = { 0: 0, 1: 0, 2: 0 };
    const percentages = calculateVotePercentages(votes);
    
    expect(percentages[0]).toBe(0);
    expect(percentages[1]).toBe(0);
    expect(percentages[2]).toBe(0);
  });

  test('validates vote data structure', () => {
    expect(validateVoteData({ 0: 5, 1: 3, 2: 7 })).toBe(true);
    expect(validateVoteData({ 0: -1, 1: 3, 2: 7 })).toBe(false);
    expect(validateVoteData({ 0: 5, 1: 3 })).toBe(false); // Missing statement 2
  });
});
```

### Game Data Validation Testing
```typescript
import { validateGameSession, validateCandidateData } from '../validation/game';

describe('Game Data Validation', () => {
  test('validates complete game session data', () => {
    const validSession = {
      id: 'game-123',
      adminId: 'admin-456',
      candidate: {
        name: 'John Doe',
        photoUrl: '/uploads/john-doe.jpg',
        statements: ['I have two cats', 'I lived in Japan', 'I speak French'],
        lieIndex: 1
      },
      gameState: 'setup',
      votes: { 0: { count: 0, voterIds: [] }, 1: { count: 0, voterIds: [] }, 2: { count: 0, voterIds: [] } }
    };
    
    expect(validateGameSession(validSession)).toBe(true);
  });

  test('validates candidate data requirements', () => {
    const validCandidate = {
      name: 'Jane Smith',
      photoUrl: '/uploads/jane.jpg',
      statements: ['Statement 1', 'Statement 2', 'Statement 3'],
      lieIndex: 2
    };
    
    expect(validateCandidateData(validCandidate)).toBe(true);
    
    // Test invalid lie index
    expect(validateCandidateData({ ...validCandidate, lieIndex: 3 })).toBe(false);
    
    // Test missing statements
    expect(validateCandidateData({ ...validCandidate, statements: ['One', 'Two'] })).toBe(false);
  });
});
```

## Integration Testing Patterns

### Component Interaction Testing
```python
def test_service_integration():
    """Test how services work together"""
    # Set up realistic scenario
    data_service = DataService()
    processing_service = ProcessingService(data_service)
    
    # Test actual behavior
    test_data = {"id": "test-123", "content": "sample data"}
    result = processing_service.process(test_data)
    
    # Verify behavior, not implementation
    assert result.success == True
    assert result.processed_data["id"] == "test-123"
    assert "processed" in result.processed_data["content"]
```

### Database Integration Testing
```python
@pytest.fixture
def test_database():
    """Set up test database"""
    db = create_test_database()
    yield db
    cleanup_test_database(db)

def test_data_persistence(test_database):
    """Test data persistence behavior"""
    # Save data
    test_record = {"name": "test_item", "value": 100}
    saved_id = test_database.save(test_record)
    
    # Verify it was saved correctly
    retrieved_record = test_database.get(saved_id)
    assert retrieved_record["name"] == "test_item"
    assert retrieved_record["value"] == 100
    assert retrieved_record["id"] == saved_id
```

### External Service Testing
```python
# Use appropriate mocking library for your stack
@mock_external_service
def test_external_api_integration():
    """Test external service integration behavior"""
    # Mock the external service response
    mock_service.respond_with({
        "status": "success",
        "data": {"processed": True}
    })
    
    # Test actual service behavior
    api_client = ExternalAPIClient()
    result = api_client.process_data({"test": "data"})
    
    # Verify behavior
    assert result.success == True
    assert result.data["processed"] == True
```

## User Interface Testing

### Component State Testing
```python
def test_ui_component_states():
    """Test UI component behavior in different states"""
    component = UIComponent()
    
    # Test initial state
    assert component.is_loading == False
    assert component.error_message == None
    assert component.data == None
    
    # Test loading state
    component.start_loading()
    assert component.is_loading == True
    
    # Test success state
    test_data = {"result": "success"}
    component.load_success(test_data)
    assert component.is_loading == False
    assert component.data == test_data
    assert component.error_message == None
```

### User Interaction Testing
```python
def test_user_workflow():
    """Test complete user interaction workflow"""
    interface = UserInterface()
    
    # Simulate user actions
    interface.user_clicks_button("start")
    assert interface.current_state == "started"
    
    interface.user_enters_text("test input")
    assert interface.input_value == "test input"
    
    interface.user_clicks_button("submit")
    assert interface.current_state == "submitted"
    assert interface.result.contains("test input")
```

## Error Handling Testing

### Exception Testing
```python
def test_error_handling():
    """Test error handling behavior"""
    service = DataService()
    
    # Test with invalid input
    with pytest.raises(ValidationError, match="Invalid data format"):
        service.process_data({"invalid": "format"})
    
    # Test error recovery
    try:
        service.process_unreliable_data({"unreliable": "data"})
    except ProcessingError as e:
        # Should log error and provide fallback
        assert "fallback" in str(e)
        assert service.last_error_logged == True
```

### Graceful Degradation Testing
```python
def test_service_fallback_behavior():
    """Test graceful degradation when services fail"""
    # Mock primary service failure
    with mock_service_failure("primary_service"):
        service_manager = ServiceManager()
        result = service_manager.process_with_fallback("test data")
        
        # Should use fallback successfully
        assert result.success == True
        assert result.service_used == "fallback"
        assert result.data_processed == True
```

## Performance Testing

### Response Time Testing
```python
import time

def test_operation_performance():
    """Test that operations complete within acceptable time"""
    service = PerformanceService()
    
    start_time = time.time()
    result = service.process_large_dataset(test_large_dataset)
    end_time = time.time()
    
    # Verify performance requirement
    processing_time = end_time - start_time
    assert processing_time < 5.0  # Should complete within 5 seconds
    assert result.success == True
```

### Memory Usage Testing
```python
def test_memory_efficiency():
    """Test memory usage for large operations"""
    import psutil
    import os
    
    process = psutil.Process(os.getpid())
    initial_memory = process.memory_info().rss
    
    # Perform memory-intensive operation
    service = MemoryIntensiveService()
    result = service.process_large_data(large_test_data)
    
    final_memory = process.memory_info().rss
    memory_increase = final_memory - initial_memory
    
    # Verify memory usage is reasonable
    assert memory_increase < 100 * 1024 * 1024  # Less than 100MB increase
    assert result.success == True
```

## Test Organization

### Test File Structure
```
tests/
├── unit/
│   ├── test_calculations.py
│   ├── test_validations.py
│   └── test_utilities.py
├── integration/
│   ├── test_service_integration.py
│   ├── test_database_operations.py
│   └── test_external_apis.py
├── ui/
│   ├── test_components.py
│   ├── test_workflows.py
│   └── test_interactions.py
└── conftest.py  # Shared fixtures
```

### Shared Test Fixtures
```python
# conftest.py - Shared test fixtures
import pytest

@pytest.fixture
def test_data():
    """Standard test data used across multiple tests"""
    return {
        "id": "test-123",
        "name": "Test Item",
        "value": 42,
        "active": True
    }

@pytest.fixture
def mock_service():
    """Mock external service for integration tests"""
    with mock_external_service() as service:
        service.set_default_response({"status": "success"})
        yield service

@pytest.fixture
def test_user():
    """Test user for authentication testing"""
    return create_test_user({
        "username": "testuser",
        "email": "test@example.com",
        "permissions": ["read", "write"]
    })
```

## Test Quality Standards

### Test Naming Conventions
```python
# Good test names describe the behavior being tested
def test_user_login_with_valid_credentials_succeeds():
    """Test that valid credentials allow successful login"""
    pass

def test_user_login_with_invalid_credentials_fails():
    """Test that invalid credentials prevent login"""
    pass

def test_password_reset_sends_email_to_user():
    """Test that password reset triggers email to user"""
    pass
```

### Test Documentation
```python
def test_complex_business_logic():
    """
    Test complex business rule: Users can only edit their own posts
    within 24 hours of creation, unless they have admin permissions.
    
    Scenarios tested:
    1. Owner edits within 24 hours - should succeed
    2. Owner edits after 24 hours - should fail
    3. Admin edits any post - should succeed
    4. Non-owner edits - should fail
    """
    # Test implementation here
    pass
```

## Continuous Integration

### Test Running Strategy
```yaml
# Example CI configuration
test_strategy:
  unit_tests:
    command: pytest tests/unit/ -v --tb=short
    timeout: 5 minutes
    
  integration_tests:
    command: pytest tests/integration/ -v --tb=short
    timeout: 15 minutes
    
  ui_tests:
    command: pytest tests/ui/ -v --tb=short
    timeout: 10 minutes
```

### Test Coverage Requirements
```python
# Coverage configuration example
[tool.coverage.run]
source = ["src"]
omit = [
    "*/tests/*",
    "*/migrations/*",
    "*/venv/*"
]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError"
]
fail_under = 80
```

## Success Criteria

### Test Quality Success
- Tests focus on behavior, not implementation details
- All critical user workflows have test coverage
- Edge cases and error conditions are tested
- Tests are fast, reliable, and maintainable

### Test Coverage Success
- High coverage of critical business logic
- All public APIs have comprehensive tests
- Error handling paths are tested
- Performance requirements are validated

### Test Maintainability Success
- Tests survive refactoring without modification
- Test failures indicate actual problems
- New tests follow established patterns
- Test code is clean and well-organized

Remember: **Good tests give you confidence that your software works correctly**. Focus on testing behavior that matters to users, use realistic test scenarios, and maintain tests as carefully as you maintain production code.