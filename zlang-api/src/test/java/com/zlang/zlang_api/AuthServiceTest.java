import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterUser_Success() {
        // Given
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123");
        User user = new User("123", "Test User", "test@example.com", "hashedPassword");
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("fake.jwt.token");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertNotNull(response.getToken());
        assertEquals("fake.jwt.token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_UserExists() {
        // Given
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(new User())); // Simulate user already exists

        // When/Then
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
}